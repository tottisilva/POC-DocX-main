import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const trainingType = await prisma.trainingType.findUnique({
      where: { id: Number(id) },
    });

    if (!trainingType) {
      return NextResponse.json({ error: 'trainingType not found' }, { status: 404 });
    }

    return NextResponse.json(trainingType, { status: 200 });
  } catch (error) {
    console.error('Error fetching trainingType:', error);
    return NextResponse.json({ error: 'Failed to fetch trainingType' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updatedtrainingType = await prisma.trainingType.update({
      where: { id: Number(id) },
      data: {
        title,
      },
    });
    return NextResponse.json(updatedtrainingType, { status: 200 });
  } catch (error) {
    console.error('Error updating trainingType:', error);
    return NextResponse.json({ error: 'Failed to update trainingType' }, { status: 500 });
  }
}