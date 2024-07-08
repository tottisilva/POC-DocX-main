import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma'; // Assuming you have Prisma configured properly

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(document, { status: 200 });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { title, description, uploadDate, functionalAreaId, groupNameId } = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  // Validate the request body
  if (!title || !description || !uploadDate || !functionalAreaId || !groupNameId) {
    console.error('Validation error: Missing required fields');
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const updatedDocument = await prisma.document.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        updatedAt: new Date(uploadDate),
        functionalAreaId,
        groupNameId,
        // Add other fields as needed
      },
    });
    return NextResponse.json(updatedDocument, { status: 200 });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.document.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
