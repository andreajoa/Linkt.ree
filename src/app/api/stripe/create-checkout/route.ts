import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCheckoutSchema = z.object({
  type: z.enum(['subscription', 'product', 'donation', 'tip']),
  priceId: z.string().optional(),
  amount: z.number().optional(),
  productId: z.string().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  metadata: z.record(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCheckoutSchema.parse(body)

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await StripeService.createCustomer(
        user.email!,
        user.name || undefined,
        { userId: user.id }
      )
      
      customerId = customer.id
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    let checkoutSession

    switch (validatedData.type) {
      case 'subscription':
        if (!validatedData.priceId) {
          return NextResponse.json({ error: 'Price ID required for subscription' }, { status: 400 })
        }
        
        checkoutSession = await StripeService.createCheckoutSession(
          customerId,
          validatedData.priceId,
          validatedData.successUrl,
          validatedData.cancelUrl,
          validatedData.metadata
        )
        break

      case 'product':
        if (!validatedData.productId) {
          return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
        }

        const product = await prisma.product.findUnique({
          where: { id: validatedData.productId }
        })

        if (!product) {
          return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        checkoutSession = await StripeService.createProductCheckout(
          [{ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
          }],
          user.email!,
          validatedData.successUrl,
          validatedData.cancelUrl,
          {
            productId: product.id,
            userId: user.id,
            ...validatedData.metadata
          }
        )
        break

      case 'donation':
        if (!validatedData.amount) {
          return NextResponse.json({ error: 'Amount required for donation' }, { status: 400 })
        }

        checkoutSession = await StripeService.createDonationCheckout(
          validatedData.amount,
          validatedData.successUrl,
          validatedData.cancelUrl,
          {
            userId: user.id,
            ...validatedData.metadata
          }
        )
        break

      case 'tip':
        checkoutSession = await StripeService.createTipCheckout(
          user.name || user.username || 'Creator',
          validatedData.successUrl,
          validatedData.cancelUrl,
          {
            creatorId: user.id,
            ...validatedData.metadata
          }
        )
        break

      default:
        return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
