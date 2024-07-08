import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, fileUrl, userId } = await request.json();

    if (!id || !fileUrl || !userId) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    const newDocument = await prisma.document.update({
    where: { id: Number(id) },
      data: {

        fileUrl,
        updatedAt: new Date(),
        isCheckedOut: false
      },
    });

    console.log(`Created document in database: ${newDocument.title}`);

    return NextResponse.json({ success: true, document: newDocument });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ success: false, message: 'Error creating document' }, { status: 500 });
  }
}
