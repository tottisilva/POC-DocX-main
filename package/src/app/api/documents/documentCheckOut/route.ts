import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    const newDocument = await prisma.document.update({
      where: { id: Number(id) },
      data: {
        isCheckedOut: true
      },
    });

    // Find Username by UserId
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    await prisma.documentAuditLog.create({
      data: {
        comment: `Document Checked Out by ${user.name}`,
        timestamp: new Date(),
        documentId: Number(id),
        userId: Number(userId),
      },
    });

    console.log(`Document with ID ${id} checked out by ${user.name}`);

    return NextResponse.json({ success: true, document: newDocument });
  } catch (error) {
    console.error('Error checking out document:', error);
    return NextResponse.json({ success: false, message: 'Error checking out document' }, { status: 500 });
  }
}
