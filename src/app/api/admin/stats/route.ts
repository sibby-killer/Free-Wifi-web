import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch Admin Dashboard Stats & Activity
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        // 1. Aggregates
        const totalUsers = await prisma.user.count();
        const pendingOrders = await prisma.order.count({ where: { status: "pending" } });
        const openTickets = await prisma.ticket.count({ where: { status: "open" } });

        // Revenue Calculation (Assumption: Active plans * price)
        // In a real app, this would be sum of payments. 
        // For now, we'll estimate based on 'currentPlan' users.
        // 10 Mbps = 1500, 12 Mbps = 2000
        // We don't have price strictly stored on User, only 'currentPlan'.
        // Let's use a rough estimate or 0 if no payment history.
        // Prompt says: "Revenue: KES 45,000". We can simulate or calc from Orders.
        // Better: Sum of all *completed* orders price ??
        // Let's sum price of all orders with status 'completed'.
        const revenueAgg = await prisma.order.aggregate({
            where: { status: "completed" },
            _sum: { price: true }
        });
        const totalRevenue = revenueAgg._sum.price || 0;

        // 2. Recent Activity
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { fullName: true } } }
        });

        const recentTickets = await prisma.ticket.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { fullName: true } } }
        });

        // Recent @admin chats
        // Find messages where mentionAdmin=true OR role='user' (unanswered)
        // Actually prompt says "Recent 5 @admin Tagged Messages"
        const recentChats = await prisma.chatMessage.findMany({
            where: { mentionAdmin: true },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { fullName: true } }
            }
        });

        // Fetch user details for chats manually if include fails (safeguard)
        const chatsWithUser = await Promise.all(recentChats.map(async (chat) => {
            const u = await prisma.user.findUnique({
                where: { id: chat.userId },
                select: { fullName: true }
            });
            return { ...chat, user: u };
        }));


        return NextResponse.json({
            stats: {
                totalUsers,
                pendingOrders,
                openTickets,
                totalRevenue
            },
            activity: {
                orders: recentOrders,
                tickets: recentTickets,
                chats: chatsWithUser
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
