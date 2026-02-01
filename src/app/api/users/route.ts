import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, email, phoneNumber, region, subLocation } = body;

    // Validate required fields
    if (!fullName || !email || !phoneNumber || !region || !subLocation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          fullName,
          phoneNumber,
          region,
          subLocation,
        },
      });

      return NextResponse.json({ user: updatedUser });
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        fullName,
        phoneNumber,
        region,
        subLocation,
      },
    });

    // Send welcome email
    await sendEmail({
      to: email,
      ...generateWelcomeEmail(fullName, email.split("@")[0], `${region} - ${subLocation}`),
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
