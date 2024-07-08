import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId, userId } = await req.json();

    const parsedTrainingId = parseInt(trainingId, 10)

    if (!trainingId || typeof trainingId !== 'number' || !userId || typeof userId !== 'number') {
      return NextResponse.json({ error: 'Invalid trainingId or userId' }, { status: 400 });
    }

    const steps = await prisma.userTrainingStep.findMany({
      where: {
        userId,
        trainingStep: {
          trainingId: parsedTrainingId, // This assumes trainingStep has a field trainingId
        },
      },
      include: {
        trainingStep: {
          include: {
            trainingType: true, // Include the trainingType in the response
          },
        },
      },
      orderBy: {
        trainingStepId: 'asc'
      },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error('Error fetching training steps:', error);
    return NextResponse.json({ error: 'Error fetching training steps' }, { status: 500 });
  }
}
