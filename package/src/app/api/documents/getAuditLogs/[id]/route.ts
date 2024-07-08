import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const auditLogs = await prisma.documentAuditLog.findMany({
      where: { documentId: parseInt(id, 10) },
      orderBy: { timestamp: 'desc' },
      include: { user: true }, // Assuming you want to show the user info
    });

    return NextResponse.json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ message: 'Error fetching audit logs' }, { status: 500 });
  }
}

