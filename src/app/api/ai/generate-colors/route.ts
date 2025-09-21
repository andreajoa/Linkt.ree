import { NextRequest, NextResponse } from 'next/server';
import { generateStyleRecommendations } from '@/lib/ai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const styleSchema = z.object({
  contentCategory: z.string().min(1),
  userPreferences: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = styleSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validatedData.error.flatten() }, { status: 400 });
    }

    const recommendations = await generateStyleRecommendations(validatedData.data.contentCategory, validatedData.data.userPreferences || []);
    return NextResponse.json(recommendations, { status: 200 });
  } catch (error) {
    console.error('API Error generating style recommendations:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}