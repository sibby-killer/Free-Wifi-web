import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// POST: Send Notification (Bulk/Individual)
export async function POST(req: NextRequest) {
    try {
        const { user: adminUser } = await requireAdmin();
        const body = await req.json();
        const { type, subject, message, recipients } = body;
        // type: "bulk" | "individual"
        // recipients: "all" | "kakamega" | "active" | userId (string)

        let targetUserIds: string[] = [];
        let recipientDescription = "";

        // 1. Determine Target Users
        if (type === "individual") {
            // recipients is a userId
            const user = await prisma.user.findUnique({ where: { id: recipients } });
            if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
            targetUserIds = [user.id];
            recipientDescription = `Individual: ${user.fullName} (${user.email})`;
        } else {
            // Bulk logic
            if (recipients === "all") {
                const users = await prisma.user.findMany({ select: { id: true } });
                targetUserIds = users.map(u => u.id);
                recipientDescription = "All Users";
            } else if (recipients === "kakamega" || recipients === "bungoma") {
                const users = await prisma.user.findMany({
                    where: { region: { contains: recipients, mode: 'insensitive' } },
                    select: { id: true }
                });
                targetUserIds = users.map(u => u.id);
                recipientDescription = `Users in ${recipients}`;
            } else if (recipients === "active") {
                const users = await prisma.user.findMany({
                    where: { currentPlan: { not: null } },
                    select: { id: true }
                });
                targetUserIds = users.map(u => u.id);
                recipientDescription = "Users with Active Plan";
            }
        }

        if (targetUserIds.length === 0) {
            return NextResponse.json({ error: "No recipients found" }, { status: 400 });
        }

        // 2. Create SentNotification Log
        const validAdminId = adminUser.publicMetadata.role === "admin" ? adminUser.id : undefined; // Use Clerk ID? Wait, AdminLog uses `id`. 
        // Note: Our Admin model relies on manual creation. The prompt implies there is an Admin model synced or distinct. 
        // For now, we'll store specific admin details in the `message` or similar if we strictly follow schema.
        // Actually, `SentNotification` relates to `Admin`. If logged in via Clerk as admin, we might not have a record in `Admin` table depending on implementation.
        // Let's assume we use the Clerk ID acting as Admin ID or create a dummy relation if needed.
        // Checking schema: `admin Admin? @relation...`
        // We will skip linking `adminId` for now if the Clerk User isn't in the `Admin` table, or we find the Admin record.

        // 3. Create UserNotifications (Batch)
        // Prisma createMany is efficient
        await prisma.userNotification.createMany({
            data: targetUserIds.map(uid => ({
                userId: uid,
                title: subject,
                message: message,
                type: "admin_sent",
                isRead: false
            }))
        });

        // 4. Create Audit Record
        await prisma.sentNotification.create({
            data: {
                type,
                subject,
                message,
                recipients: recipientDescription,
                sentCount: targetUserIds.length,
                // adminId: ... (We need to resolve this if strict)
            }
        });

        // 5. Log Action
        await prisma.adminLog.create({
            data: {
                action: "sent_notification",
                details: `Sent '${subject}' to ${recipientDescription} (${targetUserIds.length} users)`,
                entityType: "notification",
                // adminId: ...
            }
        });

        return NextResponse.json({
            success: true,
            count: targetUserIds.length,
            message: `Sent to ${targetUserIds.length} users`
        });

    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
