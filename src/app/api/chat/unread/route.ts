import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const unreadCount = await prisma.chatMessage.count({
            where: {
                userId,
                role: { in: ["assistant", "admin"] },
                isRead: false,
            },
        });

        return NextResponse.json({ unreadCount });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Mark all assistant/admin messages as read
        await prisma.chatMessage.updateMany({
            where: {
                userId,
                role: { in: ["assistant", "admin"] },
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking chat read:", error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
