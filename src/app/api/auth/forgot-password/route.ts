import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

// POST: Request Password Reset
export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return success even if user not found (security)
            return NextResponse.json({ success: true, message: "If account exists, email sent." });
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt
            }
        });

        // TODO: Send Email via Email Service (Placeholder)
        console.log(`[EMAIL] Password Reset Link: https://freewifike.com/reset-password?token=${token}`);

        return NextResponse.json({ success: true, message: "Reset link sent." });

    } catch (error) {
        console.error("Error requesting reset:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
