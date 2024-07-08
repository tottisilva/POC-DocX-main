import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        minScore: true,
        trainingStep: {
          select: {
            description: true,
          },
        },
      },
    });

    if (!quizzes || quizzes.length === 0) {
      return NextResponse.json({ error: 'No quizzes found' }, { status: 404 });
    }

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}
