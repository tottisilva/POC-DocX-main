import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const functionalAreas = await prisma.functionalArea.findMany();
    return NextResponse.json(functionalAreas);
  } catch (error) {
    console.error('Error fetching training types:', error);
    return NextResponse.json({ error: 'Error fetching training types' }, { status: 500 });
  }
}