import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const role = await prisma.role.findUnique({
      where: { id: Number(id) },
    });

    if (!role) {
      return NextResponse.json({ error: 'role not found' }, { status: 404 });
    }

    return NextResponse.json(role, { status: 200 });
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json({ error: 'Failed to fetch role' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { name} = await req.json();

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const updatedRole = await prisma.role.update({
      where: { id: Number(id) },
      data: {
        name
      },
    });
    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}