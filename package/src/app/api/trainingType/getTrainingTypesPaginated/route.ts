import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';
  const pageNumber = parseInt(page, 10);
  const size = parseInt(pageSize, 10);
  const sortBy = searchParams.get('sortBy') || 'title'; 
  const sortOrder = searchParams.get('sortOrder') || 'asc';

  try {
    const trainingTypes = await prisma.trainingType.findMany({
      skip: (pageNumber - 1) * size,
      take: size,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalTrainingTypes = await prisma.trainingType.count(); 

    return NextResponse.json({ trainingTypes, totalTrainingTypes, page: pageNumber, pageSize: size });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
