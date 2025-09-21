import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { StripeService } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = StripeService.verifyWebhookSignature(body, signature)
    } catch (error) {
      console.error('Webhook signature verification failed:', error)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      case 'payment_intent.succeeded':
        await handleOneTimePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const customerId = session.customer as string
    const metadata = session.metadata || {}

    // Find user by Stripe customer ID
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Handle different session types
    if (session.mode === 'subscription') {
      // Subscription checkout completed
      const subscription = await StripeService.stripe.subscriptions.retrieve(
        session.subscription as string
      )
      
      await handleSubscriptionChange(subscription)
    } else if (session.mode === 'payment') {
      // One-time payment completed
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: session.payment_intent as string,
          amount: (session.amount_total || 0) / 100,
          currency: session.currency || 'usd',
          status: 'succeeded',
          type: metadata.type || 'one_time',
          metadata: metadata as any
        }
      })

      // Handle product purchases
      if (metadata.productId) {
        await handleProductPurchase(user.id, metadata.productId, session)
      }
    }

    console.log('Checkout session completed for user:', user.id)
  } catch (error) {
    console.error('Error handling checkout session:', error)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for subscription:', subscription.id)
      return
    }

    // Determine plan based on price ID
    const priceId = subscription.items.data[0]?.price.id
    let plan = 'free'
    
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      plan = 'pro'
    } else if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) {
      plan = 'business'
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      plan = 'enterprise'
    }

    // Update or create subscription record
    await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      },
      create: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    })

    // Update user plan
    await prisma.user.update({
      where: { id: user.id },
      data: {
        plan,
        isPremium: plan !== 'free',
        planExpires: new Date(subscription.current_period_end * 1000)
      }
    })

    console.log(`Subscription ${subscription.status} for user:`, user.id, 'Plan:', plan)
  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for cancelled subscription:', subscription.id)
      return
    }

    // Update subscription record
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true
      }
    })

    // Update user plan to free (immediately or at period end)
    const shouldDowngradeImmediately = !subscription.cancel_at_period_end

    if (shouldDowngradeImmediately) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'free',
          isPremium: false,
          planExpires: null
        }
      })
    }

    console.log('Subscription cancelled for user:', user.id)
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    if (invoice.subscription) {
      // This is a subscription payment
      const subscription = await StripeService.stripe.subscriptions.retrieve(
        invoice.subscription as string
      )
      
      // Refresh AI credits for subscription renewals
      const customerId = invoice.customer as string
      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId }
      })

      if (user) {
        // Refresh AI credits based on plan
        const planCredits = {
          pro: 50,
          business: 200,
          enterprise: 1000
        }

        const credits = planCredits[user.plan as keyof typeof planCredits] || 5

        await prisma.user.update({
          where: { id: user.id },
          data: { aiCredits: credits }
        })

        console.log(`AI credits refreshed for user ${user.id}: ${credits}`)
      }
    }

    console.log('Payment succeeded for invoice:', invoice.id)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string
    
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for failed payment:', invoice.id)
      return
    }

    // You could send an email notification here
    // or temporarily suspend premium features

    console.log('Payment failed for user:', user.id, 'Invoice:', invoice.id)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleOneTimePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    const customerId = paymentIntent.customer as string
    const metadata = paymentIntent.metadata

    if (!customerId) return

    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for payment:', paymentIntent.id)
      return
    }

    // Record the payment
    await prisma.payment.create({
      data: {
        userId: user.id,
        stripePaymentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: 'succeeded',
        type: metadata.type || 'one_time',
        metadata: metadata as any
      }
    })

    console.log('One-time payment succeeded for user:', user.id)
  } catch (error) {
    console.error('Error handling one-time payment:', error)
  }
}

async function handleProductPurchase(userId: string, productId: string, session: Stripe.Checkout.Session) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      console.error('Product not found:', productId)
      return
    }

    // Create order record
    await prisma.order.create({
      data: {
        userId,
        email: session.customer_details?.email || '',
        total: (session.amount_total || 0) / 100,
        currency: session.currency || 'usd',
        status: 'paid',
        stripePaymentId: session.payment_intent as string,
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price
          }
        }
      }
    })

    // Handle digital product delivery
    if (product.isDigital && product.downloadUrl) {
      // You could send download link via email here
      console.log('Digital product purchased:', product.name)
    }

    console.log('Product purchase completed:', productId)
  } catch (error) {
    console.error('Error handling product purchase:', error)
  }
}
