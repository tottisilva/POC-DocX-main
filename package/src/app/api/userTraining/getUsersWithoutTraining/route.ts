import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId } = await req.json();

    if (!trainingId) {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    // Fetch users who don't have the specified training ID associated with them
    const usersWithoutTraining = await prisma.user.findMany({
      where: {
        NOT: {
          userTrainings: {
            some: {
              trainingId: parseInt(trainingId as string) || undefined,
            },
          },
        },
      },
    });

    return NextResponse.json(usersWithoutTraining, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
