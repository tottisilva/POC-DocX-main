import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { description, url, trainingId, typeId, documentId } = await req.json();

    if (!description || !typeId || !trainingId) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    // Retrieve the maximum stepNumber for the given trainingId
    const maxStepNumber = await prisma.trainingStep.findFirst({
      where: {
        trainingId,
      },
      orderBy: {
        stepNumber: 'desc',
      },
    });

    // Determine the new stepNumber (increment the maxStepNumber by 1)
    const newStepNumber = (maxStepNumber?.stepNumber || 0) + 1;

    // Create the new training step
    const trainingStep = await prisma.trainingStep.create({
      data: {
        description,
        url,
        typeId,
        stepNumber: newStepNumber,
        documentId,
        trainingId,
      },
    });

    return NextResponse.json(trainingStep, { status: 201 });
  } catch (error) {
    console.error('Error creating training step:', error);
    return NextResponse.json({ error: 'Failed to create training step' }, { status: 500 });
  }
}
