import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id) || !Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const deletedTraining = await prisma.training.delete({
      where: { id },
    });

    return NextResponse.json(deletedTraining);
  } catch (error) {
    return NextResponse.json({ error: 'Training not found or deletion failed' }, { status: 500 });
  }
}