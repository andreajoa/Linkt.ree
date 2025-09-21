import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateBio } from '@/lib/ai';
import { z } from 'zod';

const bioSchema = z.object({
  name: z.string().min(1),
  interests: z.array(z.string()).optional(),
  socialMedia: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = bioSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validatedData.error.flatten() }, { status: 400 });
    }

    const bio = await generateBio(validatedData.data);
    return NextResponse.json({ bio }, { status: 200 });
  } catch (error) {
    console.error('API Error generating bio:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}