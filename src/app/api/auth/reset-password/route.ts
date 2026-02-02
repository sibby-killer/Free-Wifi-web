import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

// POST: Reset Password with Token
export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Verify Token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // 2. Find User (to get Clerk ID)
        const user = await prisma.user.findUnique({
            where: { email: resetToken.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // 3. Update Password in Clerk
        // Note: We don't store passwords in Prisma User model, only in Clerk.
        await (await clerkClient()).users.updateUser(user.clerkId, {
            password: newPassword
        });

        // 4. Mark Token as Used
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true }
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
