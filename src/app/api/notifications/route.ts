import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";

// GET: Fetch notifications for the logged-in user
export async function GET(req: NextRequest) {
    try {
        const { userId } = await requireUser();

        // 1. Get Prisma User ID from Clerk ID
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!dbUser) {
            // Fallback: If user syncing is slow, only show global notifications
            const globalNotes = await prisma.notification.findMany({
                where: { isGlobal: true },
                orderBy: { createdAt: "desc" },
                take: 20
            });
            return NextResponse.json({ notifications: globalNotes });
        }

        // 2. Fetch notifications (Global OR Targeted to this User)
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { isGlobal: true },
                    { userId: dbUser.id }
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json({ notifications });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Unauthorized or Error" }, { status: 500 });
    }
}

// POST: Create a notification (Admin only)
export async function POST(req: NextRequest) {
    try {
        const { user } = await requireAdmin(); // Enforces admin role
        const body = await req.json();
        const { title, message, type, isGlobal, targetUserId } = body;

        // If targeting a specific user, we likely get their ID from the frontend.
        // Frontend should send Prisma User ID if possible, or Clerk ID.
        // Let's assume frontend sends something we can use.

        await prisma.notification.create({
            data: {
                title,
                message,
                type: type || "info",
                isGlobal: !!isGlobal,
                userId: targetUserId || null,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
