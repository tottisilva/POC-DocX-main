import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (isNaN(id) || !Number.isInteger(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const usersWithActivities = await prisma.training.findMany({
      where: {
          userId: id,
      }
  });

  if (usersWithActivities.length === 0) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json(deletedUser);
        } else {
            return NextResponse.json({ error: `Cannot delete User while having activities` }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: `Cannot delete User while having activities` }, { status: 500 });
    }
}