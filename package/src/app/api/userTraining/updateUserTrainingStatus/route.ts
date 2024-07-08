import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
 
export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';
 
export async function POST(req: NextRequest) {
  try {
    const { userId, trainingId, status, comment } = await req.json();
 
    if (!userId || !trainingId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
 
    // Check if the userTraining exists
    let userTraining = await prisma.userTraining.findUnique({
      where: {
        userId_trainingId: {
          userId: Number(userId),
          trainingId: Number(trainingId),
        },
      },
    });
 
    if (!userTraining) {
      // If userTraining doesn't exist, create a new one
      userTraining = await prisma.userTraining.create({
        data: {
          userId: Number(userId),
          trainingId: Number(trainingId),
          status,
          createdBy: Number(userId)
        },
      });
    } else {
      // If userTraining exists, update its status
      userTraining = await prisma.userTraining.update({
        where: {
          userId_trainingId: {
            userId: Number(userId),
            trainingId: Number(trainingId),
          },
        },
        data: {
          status,
        },
      });
    }

    const userTrainingAuditLog = await prisma.userTrainingAuditLog.create({
      data: {
        userId: userId,
        trainingId: trainingId,
        comment,
        newStatus: status,
        createdBy: userId,
      },
    });

 
    return NextResponse.json({ message: 'Status updated successfully', userTraining, userTrainingAuditLog }, { status: 200 });
  } catch (error) {
    console.error('Error updating user training status:', error);
    return NextResponse.json({ error: 'Failed to update user training status' }, { status: 500 });
  }
}