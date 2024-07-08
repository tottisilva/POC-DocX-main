import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const newDocument = await prisma.document.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        fileUrl: formData.get('fileUrl') as string,
        metadata: 'metadata',
        userId: parseInt(formData.get('userId') as string, 10),
        functionalAreaId: parseInt(formData.get('functionalAreaId') as string, 10),
        groupNameId: parseInt(formData.get('groupNameId') as string, 10),
        createdAt: new Date(),
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
