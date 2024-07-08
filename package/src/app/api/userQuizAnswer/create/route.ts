import prisma from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { userId, answers, quizId, score } = await req.json();

      if (!userId || !Array.isArray(answers)) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const createUserQuizAnswerPromises = answers.map(async (answer) => {
        await prisma.userQuizAnswer.create({
          data: {
            userId: parseInt(userId, 10),
            quizId: parseInt(quizId, 10),
            questionId: parseInt(answer.questionId, 10),
            answerId: parseInt(answer.answerId, 10),
            answeredAt: new Date(),
            score: parseFloat(score),
          },
        });
      });

      await Promise.all(createUserQuizAnswerPromises);

      return NextResponse.json({ message: 'UserQuizAnswers created successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error creating UserQuizAnswers:', error);
      return NextResponse.json({ error: 'Failed to create UserQuizAnswers' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
