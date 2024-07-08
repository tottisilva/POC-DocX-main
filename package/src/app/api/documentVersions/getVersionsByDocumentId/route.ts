import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Invalid documentId' }, { status: 400 });
    }

    // Fetch documents associated with the specified training ID
    const versionForDocument = await prisma.documentVersion.findMany({
      where: {
        documentId: parseInt(documentId as string),
        },
      include: {
        document: true,
        user: true,
      },
      orderBy: {
        version: 'desc'
      }
    });

    return NextResponse.json(versionForDocument, { status: 200 });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}