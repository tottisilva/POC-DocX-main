import { NextResponse, NextRequest } from 'next/server';
import prisma from '../../../../../../lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);

    if (isNaN(id) || !Number.isInteger(id)) {
        return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    try {
        const documentsWithFunctionalArea = await prisma.document.findMany({
            where: {
                functionalAreaId: id,
            }
        });

        if (documentsWithFunctionalArea.length === 0) {
            const deletedFunctionalArea = await prisma.functionalArea.delete({
                where: { id },
            });
            return NextResponse.json(deletedFunctionalArea);
        } else {
            return NextResponse.json({ error: `Cannot delete Functional Area because it is being used` }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: `Cannot delete Functional Area due to an internal error` }, { status: 500 });
    }
}
