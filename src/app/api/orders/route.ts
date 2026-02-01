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
    const {
      plan,
      price,
      region,
      subLocation,
      address,
      mapsLink,
      preferredDate,
      whatsappNumber,
      notes,
    } = body;

    // Validate required fields
    if (!plan || !price || !region || !subLocation || !address || !preferredDate || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        userId,
        plan,
        price,
        region,
        subLocation,
        address,
        mapsLink: mapsLink || null,
        preferredDate: new Date(preferredDate),
        whatsappNumber,
        notes: notes || null,
        status: "pending",
      },
    });

    // Send email notifications
    const { clerkClient } = await import("@clerk/nextjs/server");
    const user = await (await clerkClient()).users.getUser(userId);
    const userName = user.firstName || user.username || "Customer";
    const userEmail = user.emailAddresses[0]?.emailAddress || "";

    // Send confirmation to customer
    const { sendEmail, generateOrderConfirmationEmail } = await import("@/lib/email");
    await sendEmail({
      to: userEmail,
      ...generateOrderConfirmationEmail(
        userName,
        order.id,
        plan,
        address,
        new Date(preferredDate).toLocaleDateString()
      ),
    });

    // Send notification to admin
    const { generateAdminOrderNotification } = await import("@/lib/email");
    const { env } = await import("@/lib/env");
    await sendEmail({
      to: env.server.ADMIN_EMAIL,
      ...generateAdminOrderNotification(
        userName,
        user.phoneNumbers[0]?.phoneNumber || "N/A",
        plan,
        region,
        subLocation,
        address,
        new Date(preferredDate).toLocaleDateString(),
        order.id
      ),
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
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

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
