import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch Sent Notifications History
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const logs = await prisma.sentNotification.findMany({
            include: {
                admin: {
                    select: { fullName: true, email: true }
                }
            },
            orderBy: { createdAt: "desc" },
            take: 50
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error("Error fetching sent logs:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
