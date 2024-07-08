import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { documentId, fileUrl, userId } = await request.json();

    if (!documentId || !fileUrl || !userId) {
      return NextResponse.json({ success: false, message: 'Invalid input data' }, { status: 400 });
    }

    // Check if the document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 });
    }

    const parsedUserId = parseInt(userId, 10);

    // Create a new document version and log the audit
    const versionId = await handleExistingDocument(documentId, fileUrl, parsedUserId);

    console.log(`Created new version for documentId: ${documentId}`);
    return NextResponse.json({ success: true, versionId });

  } catch (error) {
    console.error('Error creating document version:', error);
    return NextResponse.json({ success: false, message: 'Error creating document version' }, { status: 500 });
  }
}

async function handleExistingDocument(documentId: number, fileUrl: string, userId: number) {
  const latestVersion = await prisma.documentVersion.findFirst({
    where: { documentId },
    orderBy: { version: 'desc' },
  });
  const newVersionNumber = (latestVersion?.version || 0) + 1;

  const newVersion = await prisma.documentVersion.create({
    data: {
      documentId,
      version: newVersionNumber,
      url: fileUrl,
      createdBy: userId,
      createdAt: new Date(),
    },
  });

  await prisma.document.update({
    where: { id: documentId },
    data: { updatedAt: new Date() },
  });

  // Create a new audit log entry
  await prisma.documentAuditLog.create({
    data: {
      comment: `New version uploaded: ${newVersionNumber}`,
      timestamp: new Date(),
      documentId: documentId,
      userId: userId,
    },
  });

  return newVersion.id;
}
