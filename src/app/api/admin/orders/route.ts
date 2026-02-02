import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch All Orders
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();
        const orders = await prisma.order.findMany({
            include: {
                user: { select: { fullName: true, email: true, phoneNumber: true, region: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ orders });
    } catch (error) {
        return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
    }
}

// PUT: Update Order Status
export async function PUT(req: NextRequest) {
    try {
        const { user: admin } = await requireAdmin();
        const { id, status } = await req.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        // Log it
        await prisma.adminLog.create({
            data: {
                action: "update_order",
                details: `Updated Order #${id.slice(-4)} status to ${status}`,
                entityType: "order",
                entityId: id
            }
        });

        // Notify User
        if (status === "active" || status === "completed") {
            await prisma.userNotification.create({
                data: {
                    userId: order.userId,
                    title: "Order Update",
                    message: `Your order #${id.slice(-4)} is now ${status}.`,
                    type: "order"
                }
            });
        }

        return NextResponse.json({ success: true, order });
    } catch (error) {
        return NextResponse.json({ error: "Error updating order" }, { status: 500 });
    }
}
