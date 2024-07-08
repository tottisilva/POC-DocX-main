import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId, userId } = await req.json();

    if (!trainingId || typeof trainingId !== 'number' || !userId) {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    const steps = await prisma.userTrainingStep.findMany({
      where: {
        userId: userId,
        trainingStep: {
          trainingId, // This assumes trainingStep has a field trainingId
        },
      },
      orderBy: {
        trainingStep: {
          stepNumber: 'asc', // Adjust ordering based on your schema
        }
      },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error('Error fetching training steps:', error);
    return NextResponse.json({ error: 'Error fetching training steps' }, { status: 500 });
  }
}
