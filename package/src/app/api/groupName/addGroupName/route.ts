import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function POST(req: NextRequest) {
  const { name, code } = await req.json();

  if (!name || !code) {
    return NextResponse.json({ error: 'Name and code are required' }, { status: 400 });
  }

  try {
    const existingGroup = await prisma.groupName.findFirst({
      where: { code },
    });

    if (existingGroup) {
      return NextResponse.json({ error: 'Code already exists' }, { status: 409 });
    }

    const newGroupName = await prisma.groupName.create({
      data: {
        name,
        code,
      },
    });

    return NextResponse.json(newGroupName, { status: 201 });
  } catch (error) {
    console.error('Error creating group name:', error);
    return NextResponse.json({ error: 'Failed to create group name' }, { status: 500 });
  }
}
