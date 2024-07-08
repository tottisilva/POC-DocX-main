import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingStepId } = await req.json();

    if (!trainingStepId) {
      return NextResponse.json({ error: 'Invalid trainingStepId' }, { status: 400 });
    }

    // Fetch documents associated with the specified training ID
    const documentsForTraining = await prisma.document.findMany({
      where: {
        trainingSteps: {
          some: {
            id: parseInt(trainingStepId as string),
          },
        },
      },
      include: {
        functionalArea: true, 
        groupNames: true,
        trainingSteps: true
      },
    });

    return NextResponse.json(documentsForTraining, { status: 200 });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
