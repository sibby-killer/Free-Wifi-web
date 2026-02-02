
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const { id } = params;
        await prisma.messageTemplate.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await requireAdmin();
        const { id } = params;
        const body = await req.json();
        const { name, content, category } = body;

        const template = await prisma.messageTemplate.update({
            where: { id },
            data: { name, content, category }
        });

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
