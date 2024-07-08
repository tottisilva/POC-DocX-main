import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const training = await prisma.training.findUnique({
      where: { id: Number(id) },
    });

    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }

    return NextResponse.json(training, { status: 200 });
  } catch (error) {
    console.error('Error fetching training:', error);
    return NextResponse.json({ error: 'Failed to fetch training' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { description, url, typeId, userId, documentId} = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Validate the request body
  if (!description || !userId ) {
    console.error('Validation error: Missing required fields');
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updatedTraining = await prisma.training.update({
      where: { id: Number(id) },
      data: {
        description,
        url,
        userId: parseInt(userId, 10),
      },
    });
    return NextResponse.json(updatedTraining, { status: 200 });
  } catch (error) {
    console.error('Error updating training:', error);
    return NextResponse.json({ error: 'Failed to update training' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }
  
    try {
      const deleteTraining = await prisma.training.delete({ where: { id: Number(id)},
    });
    
    return NextResponse.json(deleteTraining, { status: 200 });
    
  } catch (error) {
      console.error('Error updating training:', error);
      return NextResponse.json({ error: 'Failed to delete training' }, { status: 500 });
    }
  
}