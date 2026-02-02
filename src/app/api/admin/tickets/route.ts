import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch Tickets
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();
        const tickets = await prisma.ticket.findMany({
            include: {
                user: { select: { fullName: true, email: true, phoneNumber: true } }
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ tickets });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

// PUT: Update Ticket (Reply/Close)
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin();
        const { id, status, adminResponse } = await req.json();

        // Check current status/response to avoid overwriting if not needed? 
        // Simple logic: Update provided fields.

        const data: any = {};
        if (status) data.status = status;
        if (adminResponse) data.adminResponse = adminResponse;

        const ticket = await prisma.ticket.update({
            where: { id },
            data
        });

        // Log
        await prisma.adminLog.create({
            data: {
                action: "update_ticket",
                details: `Updated Ticket #${id.slice(-4)} status: ${status}`,
                entityType: "ticket",
                entityId: id
            }
        });

        // Notify User
        if (adminResponse || status === 'resolved') {
            await prisma.userNotification.create({
                data: {
                    userId: ticket.userId,
                    title: "Ticket Update",
                    message: `Your ticket has been updated: ${status}`,
                    type: "system"
                }
            });
        }

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
