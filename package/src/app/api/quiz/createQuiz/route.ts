// /src/app/api/quiz/createQuiz/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const { trainingStepId, title, minScore, questions } = await req.json();
  console.log("training id = ", trainingStepId);

  if (!trainingStepId || !title || !minScore || !questions || questions.length === 0) {
    return NextResponse.json({ error: 'Invalid data received' }, { status: 400 });
  }

  try {
    const existingQuiz = await prisma.quiz.findUnique({
      where: { trainingStepId },
    });

    if (existingQuiz) {
      return NextResponse.json({ error: 'Quiz already exists' }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        minScore,
        trainingStepId,
      },
    });

    const createdQuestions = await Promise.all(
      questions.map(async (q: any) => {
        const createdQuestion = await prisma.question.create({
          data: {
            text: q.text,
            quizId: quiz.id,
            answers: {
              create: q.answers.map((a: any) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          },
          include: {
            answers: true,
          },
        });
        return createdQuestion;
      })
    );

    return NextResponse.json({ quiz, questions: createdQuestions }, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { trainingStepId, title, minScore, questions } = await req.json();

  if (!trainingStepId || !title || !minScore || !questions || questions.length === 0) {
    return NextResponse.json({ error: 'Invalid data received' }, { status: 400 });
  }

  try {
    const existingQuiz = await prisma.quiz.findUnique({
      where: { trainingStepId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Delete existing questions and answers
    await prisma.answer.deleteMany({
      where: {
        question: {
          quizId: existingQuiz.id,
        },
      },
    });

    await prisma.question.deleteMany({
      where: {
        quizId: existingQuiz.id,
      },
    });

    // Update the quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: existingQuiz.id },
      data: {
        title,
        minScore,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            answers: {
              create: q.answers.map((a: any) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 });
  }
}
