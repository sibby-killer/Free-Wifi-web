import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch All Users
export async function GET(req: NextRequest) {
    try {
        const { user: admin } = await requireAdmin();
        // Maybe paginated? For now, fetch all (capped at 100 for safety or just all if small app)
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                currentPlan: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" },
            take: 100
        });
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
    }
}
