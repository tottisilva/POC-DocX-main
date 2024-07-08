import prisma from '../../../../../lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, code } = await request.json();

    // Check if the code already exists
    const existingFunctionalArea = await prisma.functionalArea.findFirst({
      where: { code },
    });

    if (existingFunctionalArea) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 400 });
    }

    const result = await prisma.functionalArea.create({
      data: {
        name,
        code,
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error creating Functional Area:', error);
    return NextResponse.json({ error: 'Failed to create Functional Area' }, { status: 500 });
  }
}
