import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { rating, content, region, subLocation } = body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5 || !region || !subLocation) {
      return NextResponse.json(
        { error: "Invalid review data" },
        { status: 400 }
      );
    }

    // Get user database ID from Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please complete your profile first." },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        rating,
        content: content || null,
        region,
        subLocation,
        approved: false, // Reviews need admin approval
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const showAll = searchParams.get("all"); // Param for admin to see all

    // Check if Admin (only if showAll is requested)
    let isAdmin = false;
    if (showAll) {
      const { userId } = await auth();
      if (userId) {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerkUser = await (await clerkClient()).users.getUser(userId);
        const role = clerkUser.publicMetadata?.role as string | undefined;
        isAdmin = role === "admin";
      }
    }

    const where: Record<string, unknown> = {};

    if (!isAdmin) {
      where.approved = true;
    }

    if (location && location !== "all") {
      const [region, subLocation] = location.split("-");
      if (region) where.region = region;
      if (subLocation) where.subLocation = subLocation;
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: isAdmin ? 100 : 50,
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Admin Check
    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const role = clerkUser.publicMetadata?.role as string | undefined;
    if (role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { reviewId, approved } = await req.json();

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: { approved }
    });

    return NextResponse.json({ success: true, review: updated });

  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
