import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    // Check if the group name exists
    const existingGroupName = await prisma.groupName.findUnique({
      where: { id: Number(id) },
    });

    if (!existingGroupName) {
      return NextResponse.json({ error: 'Group name not found' }, { status: 404 });
    }

    // Delete the group name
    await prisma.groupName.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: `Group name with id ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting group name:', error);
    return NextResponse.json({ error: 'Failed to delete group name' }, { status: 500 });
  }
}
