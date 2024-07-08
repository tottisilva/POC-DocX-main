import prisma from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const trainingType = searchParams.get('trainingType');

    const trainings = await prisma.training.findMany({
      include: {
        user: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalTrainings = await prisma.training.count({  });

    return NextResponse.json({ trainings, totalTrainings, page, pageSize }, { status: 200 });
  } catch (error) {
    console.error('Error fetching trainings:', error);
    return NextResponse.json({ error: 'Error fetching trainings' }, { status: 500 });
  }
}
