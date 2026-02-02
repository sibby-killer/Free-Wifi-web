import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch all logs
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = req.nextUrl.searchParams;
        const adminId = searchParams.get("adminId");
        const entityType = searchParams.get("entityType");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = {};
        if (adminId) where.adminId = adminId;
        if (entityType && entityType !== "all") where.entityType = entityType;

        const logs = await prisma.adminLog.findMany({
            where,
            include: {
                admin: {
                    select: { fullName: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
