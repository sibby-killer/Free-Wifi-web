import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch System Notifications (Inbox)
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const searchParams = req.nextUrl.searchParams;
        const filter = searchParams.get("filter") || "all"; // all, unread

        const where: any = {};
        if (filter === "unread") {
            where.isRead = false;
        }

        const notifications = await prisma.systemNotification.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 50
        });

        const unreadCount = await prisma.systemNotification.count({
            where: { isRead: false }
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// PUT: Mark as Read
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin();
        const body = await req.json();
        const { id } = body;

        if (id === "all") {
            await prisma.systemNotification.updateMany({
                where: { isRead: false },
                data: { isRead: true }
            });
        } else {
            await prisma.systemNotification.update({
                where: { id },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
