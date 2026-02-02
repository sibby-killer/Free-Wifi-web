import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { userId: currentUserId } = await auth();
        if (!currentUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check Admin
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerkUser = await (await clerkClient()).users.getUser(currentUserId);
        const role = clerkUser.publicMetadata?.role as string | undefined;
        if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { searchParams } = new URL(req.url);
        const targetUserId = searchParams.get("userId");
        const listUsers = searchParams.get("list");

        if (listUsers) {
            // Fetch users who have chatted
            // Group by userId? Prisma doesn't support distinct on specific field easily with sorting.
            // We need list of unique users from ChatMessage.
            // Raw query is best, or findMany distinct.

            try {
                const usersWithChats = await prisma.chatMessage.findMany({
                    distinct: ['userId'],
                    select: {
                        userId: true,
                        // We can't select other fields easily with distinct in one go for "latest".
                    }
                });

                // For each user, get details and last message
                const chats = await Promise.all(usersWithChats.map(async (chat) => {
                    const user = await prisma.user.findUnique({
                        where: { clerkId: chat.userId },
                        select: { fullName: true, phoneNumber: true }
                    });

                    const lastMsg = await prisma.chatMessage.findFirst({
                        where: { userId: chat.userId },
                        orderBy: { createdAt: 'desc' }
                    });

                    const unreadCount = await prisma.chatMessage.count({
                        where: { userId: chat.userId, role: 'user', isRead: false }
                    });

                    return {
                        userId: chat.userId,
                        fullName: user?.fullName || "Guest",
                        phone: user?.phoneNumber || "",
                        lastMessage: lastMsg?.content || "",
                        lastMessageDate: lastMsg?.createdAt,
                        unreadCount
                    };
                }));

                // Sort by date desc
                chats.sort((a, b) => {
                    const da = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
                    const db = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
                    return db - da;
                });

                return NextResponse.json({ chats });

            } catch (err) {
                console.error(err);
                return NextResponse.json({ error: "Error fetching chats" }, { status: 500 });
            }
        }

        if (targetUserId) {
            // Get history for specific user
            const messages = await prisma.chatMessage.findMany({
                where: { userId: targetUserId },
                orderBy: { createdAt: "asc" },
                take: 100
            });

            // Mark as read (Admin reading User messages)
            // We should mark only where role='user' and isRead=false
            await prisma.chatMessage.updateMany({
                where: { userId: targetUserId, role: 'user', isRead: false },
                data: { isRead: true }
            });

            return NextResponse.json({ messages });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    } catch (error) {
        console.error("Error in admin chat:", error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId: currentUserId } = await auth();
        if (!currentUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check Admin
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerkUser = await (await clerkClient()).users.getUser(currentUserId);
        const role = clerkUser.publicMetadata?.role as string | undefined;
        if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { userId, message } = await req.json();

        if (!userId || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const msg = await prisma.chatMessage.create({
            data: {
                data: {
                    userId, // The target user's ID
                    // role: "admin" is set below
                    // ChatTab uses: `message.role === "user" ? ... : ...`.
                    // So "admin" will fall into "AI" side (good).
                    // But ChatTab: `{message.role === "user" ? "bg-[#00CC88]" : "bg-[#0066FF]"}`
                    // And label `{message.role === "user" ? "U" : "AI"}`.
                    // I might want to update ChatTab to show "Admin" if role is "admin".
                    role: "admin",
                    content: message,
                    mentionAdmin: false,
                    isRead: false
                }
            });

        return NextResponse.json({ success: true, message: msg });

    } catch (error) {
        console.error("Error sending admin message:", error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
