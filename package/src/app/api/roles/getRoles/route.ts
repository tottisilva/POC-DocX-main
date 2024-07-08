import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles types:', error);
    return NextResponse.json({ error: 'Error fetching roles types' }, { status: 500 });
  }
}