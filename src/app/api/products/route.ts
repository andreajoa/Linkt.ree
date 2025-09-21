import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),
  images: z.array(z.string().url()).optional(),
  inventory: z.number().optional(),
  isDigital: z.boolean().default(false),
  downloadUrl: z.string().url().optional(),
  isActive: z.boolean().default(true)
})

const updateProductSchema = createProductSchema.partial()

// GET /api/products - List user's products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const isActive = searchParams.get('active') === 'true' ? true : undefined

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          userId: session.user.id,
          ...(isActive !== undefined && { isActive })
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { orders: true }
          }
        }
      }),
      
      prisma.product.count({
        where: {
          userId: session.user.id,
          ...(isActive !== undefined && { isActive })
        }
      })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // Create Stripe product
    const stripeProduct = await StripeService.createProduct(
      validatedData.name,
      validatedData.description,
      validatedData.images
    )

    // Create Stripe price
    const stripePrice = await StripeService.createPrice(
      stripeProduct.id,
      validatedData.price,
      validatedData.currency
    )

    // Create product in database
    const product = await prisma.product.create({
      data: {
        userId: session.user.id,
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price,
        currency: validatedData.currency,
        images: validatedData.images || [],
        inventory: validatedData.inventory,
        isDigital: validatedData.isDigital,
        downloadUrl: validatedData.downloadUrl,
        isActive: validatedData.isActive,
        stripeProductId: stripeProduct.id,
        stripePriceId: stripePrice.id
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }

    console.error('Create product error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
