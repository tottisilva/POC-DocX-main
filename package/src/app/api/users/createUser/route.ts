import prisma from '../../../../../lib/prisma';
import { NextResponse, NextRequest } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const res = await request.json();
    const { name, email, password, roleId } = res as { name: string, email: string, password: string, roleId: number };
    // const hashedPassword = await saltAndHashPassword(password);

    // Validate the request body
    if (!name || !email || !password || !roleId ) {
      console.error('Validation error: Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the user in the database
    const result = await prisma.user.create({
      data: {
        name,
        email,
        password,
        roleId: Number(roleId)
      }
    });

    return NextResponse.json({ user: result });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.error();
  }
}
