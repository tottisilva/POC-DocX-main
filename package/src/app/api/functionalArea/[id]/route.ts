import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';


// Fetch a single functional area by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const functionalArea = await prisma.functionalArea.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!functionalArea) {
      return NextResponse.json({ error: 'Functional area not found' }, { status: 404 });
    }

    return NextResponse.json(functionalArea);
  } catch (error) {
    console.error('Error fetching functional area:', error);
    return NextResponse.json({ error: 'Error fetching functional area' }, { status: 500 });
  }
}

// Update a functional area by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, code } = await request.json();

  try {
    // Check if the code already exists for another functional area
    const existingFunctionalArea = await prisma.functionalArea.findFirst({
      where: {
        code,
        id: { not: parseInt(id, 10) },
      },
    });

    if (existingFunctionalArea) {
      return NextResponse.json({ error: 'Code already exists for another functional area' }, { status: 409 });
    }

    const updatedFunctionalArea = await prisma.functionalArea.update({
      where: { id: parseInt(id, 10) },
      data: { name, code },
    });

    return NextResponse.json(updatedFunctionalArea);
  } catch (error) {
    console.error('Error updating functional area:', error);
    return NextResponse.json({ error: 'Error updating functional area' }, { status: 500 });
  }
}

// Check if code already exists excluding the current functional area
export async function POST(request: Request) {
  const { code, id } = await request.json();

  try {
    const existingFunctionalArea = await prisma.functionalArea.findFirst({
      where: {
        code,
        id: { not: parseInt(id, 10) },
      },
    });

    if (existingFunctionalArea) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking code:', error);
    return NextResponse.json({ error: 'Error checking code' }, { status: 500 });
  }
}
