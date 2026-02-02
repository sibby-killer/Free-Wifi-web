import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch message history for a specific user
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await requireAdmin();
        const { userId } = params;

        const messages = await prisma.chatMessage.findMany({
            where: { userId: userId },
            orderBy: { createdAt: "asc" }
        });

        return NextResponse.json({ messages });

    } catch (error) {
        console.error("Error fetching chat history:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
