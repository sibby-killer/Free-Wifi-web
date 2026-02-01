import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
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

    const review = await prisma.review.create({
      data: {
        userId,
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

    const where: any = { approved: true };
    
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
      take: 50,
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
