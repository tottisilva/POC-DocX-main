import prisma from '../../../../../lib/prisma';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { name } = res as { name: string };
    // const hashedPassword = await saltAndHashPassword(password);

    // Create the role in the database
    const result = await prisma.role.create({
      data: {
        name,
      }
    });

    return NextResponse.json({ role: result });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.error();
  }
}
