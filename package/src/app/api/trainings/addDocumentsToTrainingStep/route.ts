import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trainingStepId, documentId, createdBy } = await req.json();

    // Validate input
    if (!trainingStepId || !documentId) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Ensure documentId is an integer
    const documentIdInt = parseInt(documentId, 10);

    // Update the trainingStep with the selected document
    await prisma.trainingStep.update({
      where: { id: trainingStepId },
      data: {
        documentId: documentIdInt,
      },
    });

    return NextResponse.json({ message: 'trainingStep updated successfully' });
  } catch (error) {
    console.error("Error updating trainingStep:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
