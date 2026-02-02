import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// POST: Admin replies to a user
export async function POST(req: NextRequest) {
    try {
        const { user: adminUser } = await requireAdmin();
        const body = await req.json();
        const { userId, message } = body; // userId is the Prisma User ID (target)

        if (!userId || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Create Admin Message
        const msg = await prisma.chatMessage.create({
            data: {
                userId: userId,
                role: "admin",
                content: message,
                isRead: false, // User hasn't read it yet
                adminRead: true, // Admin sent it
                adminStatus: "resolved",
                adminReply: message,
                adminReplyAt: new Date()
            }
        });

        // 2. Log Action
        await prisma.adminLog.create({
            data: {
                action: "chat_reply",
                details: `Replied to user ${userId}`,
                entityType: "chat",
                entityId: msg.id
            }
        });

        // 3. Mark user's previous messages as read by admin
        await prisma.chatMessage.updateMany({
            where: { userId: userId, role: "user", adminRead: false },
            data: { adminRead: true }
        });

        // 4. Send Notification to User (Optional: via email or push)
        await prisma.userNotification.create({
            data: {
                userId: userId,
                title: "New Message from Support",
                message: "An admin has replied to your message.",
                type: "system",
            }
        });

        return NextResponse.json({ success: true, message: msg });

    } catch (error) {
        console.error("Error replying to chat:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
