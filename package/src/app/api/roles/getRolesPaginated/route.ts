import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const pageSize = searchParams.get('pageSize') || '10';
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const pageNumber = parseInt(page, 10);
  const size = parseInt(pageSize, 10);

  try {
    const roles = await prisma.role.findMany({
      skip: (pageNumber - 1) * size,
      take: size,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const totalRoles = await prisma.role.count();
    console.log(roles);
    return NextResponse.json({ roles, totalRoles, page: pageNumber, pageSize: size });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
