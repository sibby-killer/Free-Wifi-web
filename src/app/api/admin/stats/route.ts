import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch Admin Dashboard Stats & Activity
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        // 1. Aggregates
        // Use Promise.all for parallel fetching
        const [
            totalUsers,
            pendingOrders,
            openTickets,
            usersCount, // For reference if needed separate from strict 'totalUsers'
            revenueAgg
        ] = await Promise.all([
            prisma.user.count(),
            prisma.order.count({ where: { status: "pending" } }),
            prisma.ticket.count({ where: { status: "open" } }),
            prisma.user.count(),
            prisma.order.aggregate({
                where: {
                    status: "completed",
                    // Optional: Filter by this month/year if needed. For now, total lifetime revenue as per prompt implication.
                    // Or follow prompt: "Monthly Revenue" implies current month. 
                    // Let's do current month revenue to match "Monthly Revenue" label in prompt.
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: { price: true }
            })
        ]);

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
        const recentChats = await prisma.chatMessage.findMany({
            where: { mentionAdmin: true },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { fullName: true } } }
        });


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
                chats: recentChats
            }
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
