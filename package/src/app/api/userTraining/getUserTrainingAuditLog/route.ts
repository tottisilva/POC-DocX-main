import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId, userId } = await req.json();

    if (!trainingId || !userId) {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    const parsedTrainingId = parseInt(trainingId, 10)
    const parsedUserId = parseInt(userId, 10)

    // Fetch users who have the specified training ID associated with them
    const usersWithTraining = await prisma.userTrainingAuditLog.findMany({
      where: {
        trainingId: parsedTrainingId,
        userId: parsedUserId,
      },
      include: {
        creator: true,
        userTraining:true
      },
      orderBy: {
        id: 'desc'
      }
    });

    return NextResponse.json(usersWithTraining, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
