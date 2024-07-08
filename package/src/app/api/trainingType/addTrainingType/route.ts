import prisma from '../../../../../lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const res = await request.json();
  const { title} = res as { title: string };

  const result = await prisma.trainingType.create({
    data: {
      title,
      },
});
  return NextResponse.json({ result });
}