import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

// PUT: Update Theme
export async function PUT(req: NextRequest) {
    try {
        const { userId } = await requireUser();
        const { theme } = await req.json();

        if (!["light", "dark", "ocean", "forest"].includes(theme)) {
            return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
        }

        // Update User Theme (using Clerk ID to find Prisma User)
        await prisma.user.update({
            where: { clerkId: userId },
            data: { theme }
        });

        return NextResponse.json({ success: true, theme });

    } catch (error) {
        console.error("Error updating theme:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
