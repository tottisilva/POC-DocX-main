import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';


// Fetch a single Group Name by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const groupName = await prisma.groupName.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!groupName) {
      return NextResponse.json({ error: 'Group Name not found' }, { status: 404 });
    }

    return NextResponse.json(groupName);
  } catch (error) {
    console.error('Error fetching Group Name:', error);
    return NextResponse.json({ error: 'Error fetching Group Name' }, { status: 500 });
  }
}

// Update a Group Name by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name, code } = await request.json();

  try {
    // Check if the code already exists for another Group Name
    const existingGroupName = await prisma.groupName.findFirst({
      where: {
        code,
        id: { not: parseInt(id, 10) },
      },
    });

    if (existingGroupName) {
      return NextResponse.json({ error: 'Code already exists for another Group Name' }, { status: 409 });
    }

    const updatedGroupName = await prisma.groupName.update({
      where: { id: parseInt(id, 10) },
      data: { name, code },
    });

    return NextResponse.json(updatedGroupName);
  } catch (error) {
    console.error('Error updating Group Name:', error);
    return NextResponse.json({ error: 'Error updating Group Name' }, { status: 500 });
  }
}

// Check if code already exists excluding the current Group Name
export async function POST(request: Request) {
  const { code, id } = await request.json();

  try {
    const existingGroupName = await prisma.groupName.findFirst({
      where: {
        code,
        id: { not: parseInt(id, 10) },
      },
    });

    if (existingGroupName) {
      return NextResponse.json({ exists: true });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Error checking code:', error);
    return NextResponse.json({ error: 'Error checking code' }, { status: 500 });
  }
}
