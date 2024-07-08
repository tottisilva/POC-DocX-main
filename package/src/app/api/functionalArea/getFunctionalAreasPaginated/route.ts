import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';
  const pageNumber = parseInt(page, 10);
  const size = parseInt(pageSize, 10);
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const searchTerm = searchParams.get('searchTerm') || '';

  try {
    const functionalAreas = await prisma.functionalArea.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
      skip: (pageNumber - 1) * size,
      take: size,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalFunctionalAreas = await prisma.functionalArea.count({
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            code: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return NextResponse.json({
      functionalAreas,
      totalFunctionalAreas,
      page: pageNumber,
      pageSize: size,
    });
  } catch (error) {
    console.error('Error fetching functional areas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
