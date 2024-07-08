import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function POST(req: NextRequest) {
  try {
    const { userId, trainingStepId, status } = await req.json();

    if (!userId || !trainingStepId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the userTrainingStep exists
    let userTrainingStep = await prisma.userTrainingStep.findUnique({
      where: {
        userId_trainingStepId: {
          userId: Number(userId),
          trainingStepId: Number(trainingStepId),
        },
      },
    });

    if (!userTrainingStep) {
      // If userTrainingStep doesn't exist, create a new one
      userTrainingStep = await prisma.userTrainingStep.create({
        data: {
          userId: Number(userId),
          trainingStepId: Number(trainingStepId),
          stepStatus: status,
        },
      });
    } else {
      // If userTrainingStep exists, update its status
      userTrainingStep = await prisma.userTrainingStep.update({
        where: {
          userId_trainingStepId: {
            userId: Number(userId),
            trainingStepId: Number(trainingStepId),
          },
        },
        data: {
          stepStatus: status,
        },
      });
    }

    return NextResponse.json({ message: 'Status updated successfully', userTrainingStep }, { status: 200 });
  } catch (error) {
    console.error('Error updating user training status:', error);
    return NextResponse.json({ error: 'Failed to update user training status' }, { status: 500 });
  }
}
