import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingId } = await req.json();

    if (!trainingId || typeof trainingId !== 'string') {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    const id = parseInt(trainingId, 10);

    const steps = await prisma.trainingStep.findMany({
      where: {
        trainingId: id,
      },
    });

    return NextResponse.json(steps);
  } catch (error) {
    console.error('Error fetching training steps:', error);
    return NextResponse.json({ error: 'Error fetching training steps' }, { status: 500 });
  }
}
