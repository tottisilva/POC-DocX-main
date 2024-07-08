import prisma from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc';
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const trainingTypeId = searchParams.get('trainingTypeId');

  try {
    const whereCondition: any = {};
    
    if (userId) {
      whereCondition.userId = parseInt(userId, 10);
    }

    if (status) {
      whereCondition.status = status;
    }

    if (trainingTypeId) {
      whereCondition.training = {
        trainingTypeId: parseInt(trainingTypeId, 10)
      };
    }

    const totalUserTrainings = await prisma.userTraining.count({
      where: whereCondition,
    });

    const userTrainings = await prisma.userTraining.findMany({
      where: whereCondition,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        user: true,
        training: true
      },
    });

    return NextResponse.json({
      userTrainings,
      totalUserTrainings,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('Error fetching user trainings:', error);
    return NextResponse.json({ error: 'Failed to fetch user trainings' }, { status: 500 });
  }
}
