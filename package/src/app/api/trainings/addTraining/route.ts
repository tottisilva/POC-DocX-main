import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { description, url, userId } = await req.json();

  if (!description || !userId ) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
  }

  try {
    const training = await prisma.training.create({
      data: {
        description,
        url,
        userId: parseInt(userId, 10),
      },
    });

    return NextResponse.json(training, { status: 201 });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json({ error: 'Failed to create training' }, { status: 500 });
  }
}
