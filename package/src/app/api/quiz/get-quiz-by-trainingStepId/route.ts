// /src/app/api/quiz/get-quiz-by-trainingStepId/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const trainingStepId = searchParams.get('trainingStepId');

  if (!trainingStepId) {
    return NextResponse.json({ error: 'Training ID is required' }, { status: 400 });
  }

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { trainingStepId: parseInt(trainingStepId) },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json(quiz, { status: 200 });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
