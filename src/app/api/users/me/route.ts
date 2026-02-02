
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// PUT: Update current user profile
export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { fullName, phone, altPhone, whatsappNumber, region, subLocation, address, mapsLink, theme } = body;

        // Determine profile completion
        // Check if critical fields are present
        const isComplete = !!(fullName && phone && region && subLocation && address);

        const updatedUser = await prisma.user.update({
            where: { clerkId: userId },
            data: {
                fullName,
                phoneNumber: phone, // Mapping phone to phoneNumber
                altPhone,
                whatsappNumber,
                region,
                subLocation,
                address,
                mapsLink,
                theme,
                profileComplete: isComplete
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// GET: Fetch current user profile (if needed specifically)
export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
