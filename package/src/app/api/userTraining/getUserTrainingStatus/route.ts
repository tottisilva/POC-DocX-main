import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId, userId } = await req.json();

    const parsedTrainingId = parseInt(trainingId, 10);
    const parsedUserId = parseInt(userId, 10);

    if (!trainingId || !userId || isNaN(parsedTrainingId) || isNaN(parsedUserId)) {
      return NextResponse.json({ error: 'Invalid trainingId or userId' }, { status: 400 });
    }

    // Fetch userTraining based on trainingId and userId
    const userTraining = await prisma.userTraining.findFirst({
      where: {
        trainingId: parsedTrainingId,
        userId: parsedUserId
      },
      include: {
        user: true
      }
    });

    if (!userTraining) {
      return NextResponse.json({ error: 'User training not found' }, { status: 404 });
    }

    // Assuming userTraining has a 'status' field, return it
    return NextResponse.json({ status: userTraining.status }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user training status:', error);
    return NextResponse.json({ error: 'Failed to fetch user training status' }, { status: 500 });
  }
}
