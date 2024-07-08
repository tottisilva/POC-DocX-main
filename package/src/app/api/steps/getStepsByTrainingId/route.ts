import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';
  const sortBy = searchParams.get('sortBy') || 'stepNumber';

  try {
    const { trainingId } = await req.json();

    const parsedTrainingId = parseInt(trainingId,10);

    if (!parsedTrainingId) {
      return NextResponse.json({ error: 'Invalid trainingId' }, { status: 400 });
    }

    const trainingSteps = await prisma.trainingStep.findMany({
        where: {
          trainingId: parsedTrainingId
        },
        include: {
          trainingType: true
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      });
    
      const totalTrainingSteps = await prisma.trainingStep.count({
        where: {
          trainingId: parsedTrainingId
        },
      });
      
    return NextResponse.json( { trainingSteps, totalTrainingSteps, page, pageSize });
  } catch (error) {
    console.error('Error fetching training steps:', error);
    return NextResponse.json({ error: 'Failed to fetch training steps' }, { status: 500 });
  }
}
