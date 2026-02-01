import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        // If user exists, return success
        if (user) {
            return NextResponse.json({ user, status: "exists" });
        }

        // If user missing, fetch from Clerk and create
        try {
            const { clerkClient } = await import("@clerk/nextjs/server");
            const clerkUser = await (await clerkClient()).users.getUser(userId);

            const email = clerkUser.emailAddresses[0]?.emailAddress;
            if (!email) {
                return NextResponse.json({ error: "No email found" }, { status: 400 });
            }

            // Default values since logic might be missing some fields if skipping onboarding
            // But we try to get metadata if available
            const metadata = clerkUser.unsafeMetadata as any || {};

            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                    email,
                    phoneNumber: metadata.phoneNumber || clerkUser.phoneNumbers?.[0]?.phoneNumber || "0000000000", // Fallback
                    region: metadata.region || "Nairobi", // Fallback
                    subLocation: metadata.subLocation || "Central", // Fallback
                },
            });

            return NextResponse.json({ user, status: "created" }, { status: 201 });

        } catch (clerkError) {
            console.error("Clerk fetch error:", clerkError);
            return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
        }

    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
