import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET All Reviews
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();
        const reviews = await prisma.review.findMany({
            include: { user: { select: { fullName: true } } },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ reviews });
    } catch (error) { error; return NextResponse.json({ error: "Error" }, { status: 500 }); }
}

// DELETE Review
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin();
        const { id } = await req.json(); // Or query param

        await prisma.review.delete({ where: { id } });

        // Log it
        await prisma.adminLog.create({
            data: {
                action: "delete_review",
                details: `Deleted review ID ${id}`,
                entityType: "review",
                entityId: id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
