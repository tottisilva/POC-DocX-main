import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userIds, trainingId, createdBy } = await req.json();

    if (!userIds || !trainingId || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const parsedTrainingId = parseInt(trainingId);
    const parsedCreatedBy = parseInt(createdBy);

    if (isNaN(parsedTrainingId) || isNaN(parsedCreatedBy)) {
      return NextResponse.json({ error: 'Invalid ID values' }, { status: 400 });
    }

    // Fetch training steps for the given trainingId
    const trainingSteps = await prisma.trainingStep.findMany({
      where: {
        trainingId: parsedTrainingId,
      },
      orderBy: {
        id: 'asc', // Adjust order based on your schema
      },
    });

    if (!trainingSteps || trainingSteps.length === 0) {
      return NextResponse.json({ error: 'No training steps found for the provided trainingId' }, { status: 404 });
    }

    // Create UserTraining and UserTrainingStep records
    await Promise.all(userIds.map(async (userId: number) => {
      if (isNaN(userId)) {
        throw new Error('Invalid userId value');
      }

      // Create UserTraining record
      const userTraining = await prisma.userTraining.create({
        data: {
          userId,
          trainingId: parsedTrainingId,
          createdBy: parsedCreatedBy,
          createdAt: new Date(),
        },
      });

      // Create UserTrainingStep records for each training step
      await Promise.all(trainingSteps.map(async (step) => {
        await prisma.userTrainingStep.create({
          data: {
            userId,
            trainingStepId: step.id,
            stepStatus: 'Pending',
            createdAt: new Date(),
          },
        });
      }));

      // Create UserTrainingAuditLog record
      await prisma.userTrainingAuditLog.create({
        data: {
          userId,
          trainingId: parsedTrainingId,
          comment: 'Training Created', 
          createdAt: new Date(),
          createdBy: parsedCreatedBy,
          newStatus: 'Pending'
        },
      });

    }));

    return NextResponse.json({ message: 'UserTraining, UserTrainingStep, and UserTrainingAuditLog created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating UserTraining, UserTrainingStep, and UserTrainingAuditLog:', error);
    return NextResponse.json({ error: 'Failed to create UserTraining, UserTrainingStep, and UserTrainingAuditLog' }, { status: 500 });
  }
}
