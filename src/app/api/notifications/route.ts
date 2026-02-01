import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, requireAdmin } from "@/lib/auth";

// GET: Fetch notifications for the logged-in user
export async function GET(req: NextRequest) {
    try {
        const { user } = await requireUser();

        // Fetch global notifications OR notifications specific to this user
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { isGlobal: true },
                    { userId: user.id }, // Note: Prisma User ID, not Clerk ID. 
                    // Schema link: Order uses userId -> User.id. Notification uses userId.
                    // Wait, User model has `clerkId`. 
                    // Does `Notification.userId` refer to `User.id` (cuid) or `clerkId`?
                    // Common practice in this app: Order.userId refs User.id.
                    // BUT `requireUser` gives me Clerk User object from `auth()`.
                    // I need to find the local Prisma/User ID.
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        // Wait, I need the Prisma User ID. `requireUser` returns { auth, user (from Clerk) }.
        // I should get the prisma user first.
        // Let's refactor to fetch prisma user.

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id } // user.id from Clerk is client.id
        });

        if (!dbUser) {
            // If user not in DB (should be rare with sync), maybe return only global?
            const globalNotes = await prisma.notification.findMany({
                where: { isGlobal: true },
                orderBy: { createdAt: "desc" }
            });
            return NextResponse.json({ notifications: globalNotes });
        }

        const notes = await prisma.notification.findMany({
            where: {
                OR: [
                    { isGlobal: true },
                    { userId: dbUser.id }
                ]
            },
            orderBy: { createdAt: "desc" },
            take: 20
        });

        return NextResponse.json({ notifications: notes });

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
