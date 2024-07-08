import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function POST(req: NextRequest) {
  try {
    const { userId, trainingStepId, trainingId } = await req.json();

    if (!userId || !trainingStepId || !trainingId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedUserId = parseInt(userId, 10);
    const parsedTrainingStepId = parseInt(trainingStepId, 10);
    const parsedTrainingId = parseInt(trainingId, 10);

    if (isNaN(parsedUserId) || isNaN(parsedTrainingStepId) || isNaN(parsedTrainingId)) {
      return NextResponse.json({ error: 'Invalid userId, trainingStepId, or trainingId' }, { status: 400 });
    }

    // Check if the userTrainingStep exists
    let userTrainingStep = await prisma.userTrainingStep.findUnique({
      where: {
        userId_trainingStepId: {
          userId: parsedUserId,
          trainingStepId: parsedTrainingStepId,
        },
      },
    });

    if (!userTrainingStep) {
      // If userTrainingStep doesn't exist, create a new one with default attemptsLeft
      userTrainingStep = await prisma.userTrainingStep.create({
        data: {
          userId: parsedUserId,
          trainingStepId: parsedTrainingStepId,
          attemptsLeft: 3, // Assuming a default value of 3 attempts, change as needed
        },
      });
    } else {
      // If userTrainingStep exists, update its attemptsLeft
      if (userTrainingStep.attemptsLeft > 0) {
        userTrainingStep = await prisma.userTrainingStep.update({
          where: {
            userId_trainingStepId: {
              userId: parsedUserId,
              trainingStepId: parsedTrainingStepId,
            },
          },
          data: {
            attemptsLeft: userTrainingStep.attemptsLeft - 1,
          },
        });
      } else {
        return NextResponse.json({ error: 'No attempts left' }, { status: 400 });
      }
    }

    if (userTrainingStep.attemptsLeft === 0) {
      await prisma.userTraining.update({
        where: {
          userId_trainingId: {
            userId: parsedUserId,
            trainingId: parsedTrainingId,
          },
        },
        data: {
          status: 'Failed',
        },
      });

      await prisma.userTrainingAuditLog.create({
        data: {
          userId: parsedUserId,
          trainingId: parsedTrainingId,
          comment: 'Training Failed',
          newStatus: 'Failed',
          createdBy: parsedUserId,
        },
      });
      return NextResponse.json({ attemptsLeft: userTrainingStep.attemptsLeft });
    }

    return NextResponse.json({ message: 'Attempts left updated successfully', userTrainingStep }, { status: 200 });
  } catch (error) {
    console.error('Error updating user training attempts:', error);
    return NextResponse.json({ error: 'Failed to update user training attempts' }, { status: 500 });
  }
}
