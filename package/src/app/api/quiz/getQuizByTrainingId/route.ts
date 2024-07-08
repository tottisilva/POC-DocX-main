import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trainingStepId } = body;

    if (!trainingStepId) {
      return NextResponse.json({ error: 'Invalid trainingStepId' }, { status: 400 });
    }

    const parsedtrainingStepId = parseInt(trainingStepId);

    if (isNaN(parsedtrainingStepId)) {
      return NextResponse.json({ error: 'Invalid trainingStepId format' }, { status: 400 });
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        trainingStepId: parsedtrainingStepId,
      },
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
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
  }
}
