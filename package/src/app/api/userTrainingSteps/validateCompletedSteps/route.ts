import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    const { trainingId, userId } = await req.json();

    try {
      // Fetch all UserTrainingSteps for the given trainingId and userId
      const userTrainingSteps = await prisma.userTrainingStep.findMany({
        where: {
          trainingStep: {trainingId: Number(trainingId)},
          userId: Number(userId),
        },
        include: {
          trainingStep: true, // Include related TrainingStep
        },
      });

      // Check if all userTrainingSteps have status 'Completed'
      const allCompleted = userTrainingSteps.every(step => step.stepStatus === 'Completed');

      return NextResponse.json({ allCompleted }, { status: 200 });
    } catch (error) {
      console.error('Error checking completion status:', error);
      return NextResponse.json({ error: 'Failed to check completion status' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }
}
