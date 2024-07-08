import prisma from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { userId, quizId } = await req.json();

      if (!userId || !quizId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const userQuizAnswers = await prisma.userQuizAnswer.findMany({
        where: {
          userId: parseInt(userId, 10),
          quizId: parseInt(quizId, 10),
        },
      });

      return NextResponse.json({ userQuizAnswers }, { status: 200 });
    } catch (error) {
      console.error('Error fetching UserQuizAnswers:', error);
      return NextResponse.json({ error: 'Failed to fetch UserQuizAnswers' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
