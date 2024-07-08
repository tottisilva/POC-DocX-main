import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId } = await req.json();

    if (!trainingId) {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    // Fetch users who have the specified training ID associated with them
    const usersWithTraining = await prisma.userTraining.findMany({
      where: {
        trainingId: parseInt(trainingId as string) || undefined,
      },
      include: {
        user: true
      }
    });

    return NextResponse.json(usersWithTraining, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
