import Stripe from 'stripe'

// Não verificar a STRIPE_SECRET_KEY durante o build - só em runtime
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
}) : null;

// Helper function to ensure Stripe is configured
function ensureStripe() {
  if (!stripe || !process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured. Please add it to your environment variables.');
  }
  return stripe;
}

export { stripe }

// Pricing Plans Configuration
export const PRICING_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      maxPages: 1,
      maxBlocks: 10,
      customDomain: false,
      advancedAnalytics: false,
      removeBranding: false,
      prioritySupport: false,
      aiCredits: 5,
      storage: 100, // MB
      templates: 'basic',
      integrations: ['instagram', 'twitter'],
      ecommerce: false,
      abTesting: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: {
      maxPages: 5,
      maxBlocks: 50,
      customDomain: true,
      advancedAnalytics: true,
      removeBranding: true,
      prioritySupport: false,
      aiCredits: 50,
      storage: 2000, // MB
      templates: 'premium',
      integrations: 'all',
      ecommerce: true,
      abTesting: true
    }
  },
  business: {
    id: 'business',
    name: 'Business',
    price: 49,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: {
      maxPages: -1, // unlimited
      maxBlocks: -1, // unlimited
      customDomain: true,
      advancedAnalytics: true,
      removeBranding: true,
      prioritySupport: true,
      aiCredits: 200,
      storage: 10000, // MB
      templates: 'premium',
      integrations: 'all',
      ecommerce: true,
      abTesting: true,
      teamCollaboration: true,
      whiteLabel: false
    }
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: {
      maxPages: -1,
      maxBlocks: -1,
      customDomain: true,
      advancedAnalytics: true,
      removeBranding: true,
      prioritySupport: true,
      aiCredits: 1000,
      storage: 50000, // MB
      templates: 'premium',
      integrations: 'all',
      ecommerce: true,
      abTesting: true,
      teamCollaboration: true,
      whiteLabel: true,
      apiAccess: true,
      customIntegrations: true
    }
  }
} as const

export type PlanType = keyof typeof PRICING_PLANS

// Stripe Helper Functions
export class StripeService {
  // Get stripe instance
  static get stripe() {
    return ensureStripe();
  }

  // Create customer
  static async createCustomer(email: string, name?: string, metadata?: Record<string, string>) {
    const stripeClient = ensureStripe();
    return await stripeClient.customers.create({
      email,
      name,
      metadata
    })
  }

  // Create subscription
  static async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>) {
    const stripeClient = ensureStripe();
    return await stripeClient.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata
    })
  }

  // Create checkout session
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    const stripeClient = ensureStripe();
    return await stripeClient.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata
    })
  }

  // Create one-time payment
  static async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string,
    metadata?: Record<string, string>
  ) {
    const stripeClient = ensureStripe();
    return await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata
    })
  }

  // Create product
  static async createProduct(name: string, description?: string, images?: string[]) {
    const stripeClient = ensureStripe();
    return await stripeClient.products.create({
      name,
      description,
      images,
      metadata: {
        type: 'digital_product'
      }
    })
  }

  // Create price for product
  static async createPrice(
    productId: string,
    amount: number,
    currency: string = 'usd',
    type: 'one_time' | 'recurring' = 'one_time'
  ) {
    const stripeClient = ensureStripe();
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: Math.round(amount * 100),
      currency,
    }

    if (type === 'recurring') {
      priceData.recurring = { interval: 'month' }
    }

    return await stripeClient.prices.create(priceData)
  }

  // Update subscription
  static async updateSubscription(subscriptionId: string, priceId: string) {
    const stripeClient = ensureStripe();
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
    
    return await stripeClient.subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      proration_behavior: 'create_prorations'
    })
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean = true) {
    const stripeClient = ensureStripe();
    if (atPeriodEnd) {
      return await stripeClient.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
    } else {
      return await stripeClient.subscriptions.cancel(subscriptionId)
    }
  }

  // Get customer portal URL
  static async createCustomerPortal(customerId: string, returnUrl: string) {
    const stripeClient = ensureStripe();
    return await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
  }

  // Verify webhook signature
  static verifyWebhookSignature(payload: string, signature: string) {
    const stripeClient = ensureStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }

    return stripeClient.webhooks.constructEvent(payload, signature, webhookSecret)
  }

  // Get usage-based billing
  static async createUsageRecord(subscriptionItemId: string, quantity: number) {
    const stripeClient = ensureStripe();
    return await stripeClient.subscriptionItems.createUsageRecord(subscriptionItemId, {
      quantity,
      timestamp: Math.floor(Date.now() / 1000)
    })
  }

  // Create invoice for one-time charges
  static async createInvoice(customerId: string, description: string, amount: number) {
    const stripeClient = ensureStripe();
    
    // Create invoice item
    await stripeClient.invoiceItems.create({
      customer: customerId,
      amount: Math.round(amount * 100),
      currency: 'usd',
      description
    })

    // Create and finalize invoice
    const invoice = await stripeClient.invoices.create({
      customer: customerId,
      auto_advance: true
    })

    return await stripeClient.invoices.finalizeInvoice(invoice.id)
  }
}

// E-commerce specific functions
export class EcommerceService {
  // Create checkout for digital products
  static async createProductCheckout(
    products: Array<{ id: string; quantity: number; price: number; name: string }>,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    const stripeClient = ensureStripe();
    
    // Create line items
    const lineItems = await Promise.all(
      products.map(async (product) => {
        // Create a price for this specific product if not exists
        const stripeProduct = await stripeClient.products.create({
          name: product.name,
          metadata: { productId: product.id }
        })

        const price = await stripeClient.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(product.price * 100),
          currency: 'usd'
        })

        return {
          price: price.id,
          quantity: product.quantity
        }
      })
    )

    return await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        type: 'product_purchase',
        ...metadata
      }
    })
  }

  // Create donation checkout
  static async createDonationCheckout(
    amount: number,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    const stripeClient = ensureStripe();
    return await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
            description: 'Thank you for your support!'
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: 'donation',
        ...metadata
      }
    })
  }

  // Create tip jar
  static async createTipCheckout(
    creatorName: string,
    successUrl: string,
    cancelUrl: string,
    metadata?: Record<string, string>
  ) {
    const stripeClient = ensureStripe();
    return await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Tip for ${creatorName}`,
            description: 'Show your appreciation!'
          },
          unit_amount: 500 // $5 default
        },
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 100
        }
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: 'tip',
        creator: creatorName,
        ...metadata
      }
    })
  }
}
