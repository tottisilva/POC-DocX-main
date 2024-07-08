// API Endpoint to fetch user training step status
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingStepId, userId } = await req.json();

    const parsedTrainingStepId = parseInt(trainingStepId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedTrainingStepId) || isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'Invalid trainingStepId or userId' }, { status: 400 });
    }

    const userTrainingStep = await prisma.userTrainingStep.findFirst({
      where: {
          trainingStepId: parsedTrainingStepId,
          userId: parsedUserId,
      },
    });

    if (!userTrainingStep) {
      return NextResponse.json({ error: 'UserTrainingStep not found' }, { status: 404 });
    }

    return NextResponse.json({stepStatus: userTrainingStep.stepStatus}, { status: 200 });
  } catch (error) {
    console.error('Error fetching user training step status:', error);
    return NextResponse.json({ error: 'Failed to fetch user training step status' }, { status: 500 });
  }
}
