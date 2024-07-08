import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../../../lib/prisma';

export async function DELETE(_request: NextRequest, { params }: { params: { userId: string, trainingId: string } }) {
  const { userId, trainingId } = params;

  const parsedUserId = parseInt(userId, 10);
  const parsedTrainingId = parseInt(trainingId, 10);

  if (isNaN(parsedUserId) || !Number.isInteger(parsedUserId) || isNaN(parsedTrainingId) || !Number.isInteger(parsedTrainingId)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const deletedUserTraining = await prisma.userTraining.delete({
      where: {
        userId_trainingId: {
          userId: parsedUserId,
          trainingId: parsedTrainingId
        }
      }
    });

    return NextResponse.json(deletedUserTraining);
  } catch (error) {
    return NextResponse.json({ error: 'UserTraining not found or deletion failed' }, { status: 500 });
  }
}
