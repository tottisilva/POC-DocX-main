import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const trainingStep = await prisma.trainingStep.findUnique({
      where: { id: Number(id) },
      include: {trainingType: true}
    });

    if (!trainingStep) {
      return NextResponse.json({ error: 'training Step not found' }, { status: 404 });
    }

    return NextResponse.json(trainingStep, { status: 200 });
  } catch (error) {
    console.error('Error fetching training Step:', error);
    return NextResponse.json({ error: 'Failed to fetch training Step' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { description, url, trainingId, typeId, documentId } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updatedtrainingType = await prisma.trainingStep.update({
      where: { id: Number(id) },
      data: {
        description,
        url,
        typeId,
        documentId,
        trainingId
      },
    });
    return NextResponse.json(updatedtrainingType, { status: 200 });
  } catch (error) {
    console.error('Error updating trainingStep:', error);
    return NextResponse.json({ error: 'Failed to update training Step' }, { status: 500 });
  }
}