import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const sortBy = searchParams.get('sortBy') || 'title';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const functionalAreaId = searchParams.get('functionalAreaId');
  const groupNameId = searchParams.get('groupNameId');

  try {
    const where: any = {};

    if (functionalAreaId) {
      where.functionalAreaId = parseInt(functionalAreaId, 10);
    }

    if (groupNameId) {
      where.groupNames = {
        some: {
          id: parseInt(groupNameId, 10),
        },
      };
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        groupNames: true,
        functionalArea: true,
        user: true,
        versions: true // Ensure we include versions as an array
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalDocuments = await prisma.document.count({
      where,
    });

    return NextResponse.json({ documents, totalDocuments, page, pageSize });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
