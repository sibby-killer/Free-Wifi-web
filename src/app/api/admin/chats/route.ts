import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch all active chat conversations
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        // Group messages by userId to find unique conversations
        // Prisma doesn't support "distinct on" easily with aggregations in findMany for complex relation loading
        // Strategy: Fetch distinct userIds from ChatMessage, then fetch User details and latest message for each.

        const distinctUsers = await prisma.chatMessage.findMany({
            distinct: ['userId'],
            select: { userId: true },
            orderBy: { createdAt: 'desc' }
        });

        const chats = await Promise.all(distinctUsers.map(async (u) => {
            // Get User Details (Prisma User ID from Chat userId, wait, Chat.userId is Clerk ID? Schema says "Clerk user ID (no foreign key)")
            // Schema: "userId String". Comment: "Clerk user ID"
            // But Relation "user User @relation..." implies foreign key linkage?
            // Wait, schema check:
            // model ChatMessage { userId String ... user User @relation(fields: [userId], references: [id]) }
            // The foreign key IS `User.id` (cuid), NOT `clerkId`.
            // So ChatMessage.userId is the Prisma User ID.

            const user = await prisma.user.findUnique({
                where: { id: u.userId },
                select: { id: true, fullName: true, region: true, subLocation: true, email: true }
            });

            const lastMessage = await prisma.chatMessage.findFirst({
                where: { userId: u.userId },
                orderBy: { createdAt: 'desc' }
            });

            const unreadCount = await prisma.chatMessage.count({
                where: { userId: u.userId, role: 'user', adminRead: false }
            });

            // Determine status
            // If last message from admin, status = resolved/replied?
            // If last message from user, status = new/pending?
            const status = unreadCount > 0 ? "new" : "resolved";

            return {
                user,
                lastMessage,
                unreadCount,
                status
            };
        }));

        // Sort by latest message
        chats.sort((a, b) => (new Date(b.lastMessage?.createdAt || 0).getTime() - new Date(a.lastMessage?.createdAt || 0).getTime()));

        return NextResponse.json({ chats });

    } catch (error) {
        console.error("Error fetching admin chats:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
