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
    const {
      plan,
      price,
      region,
      subLocation,
      address,
      preferredDate,
      whatsappNumber,
      notes,
    } = body;

    // Validate required fields (address is now optional)
    if (!plan || !price || !region || !subLocation || !preferredDate || !whatsappNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user database ID from Clerk ID
    // Get user database ID from Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    // Auto-create user if missing (self-healing)
    if (!user) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const clerkUser = await (await clerkClient()).users.getUser(clerkId);

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        if (!email) {
          return NextResponse.json(
            { error: "User email not found in auth provider" },
            { status: 400 }
          );
        }

        user = await prisma.user.create({
          data: {
            clerkId,
            fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Customer",
            email,
            phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber || whatsappNumber,
            region: region,
            subLocation: subLocation,
          },
          select: { id: true }
        });
      } catch (createError) {
        console.error("Failed to auto-create user:", createError);
        return NextResponse.json(
          { error: "Failed to create user profile. Please try again." },
          { status: 500 }
        );
      }
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        plan,
        price,
        region,
        subLocation,
        address: address || `${subLocation}, ${region}`, // Default to sub-location if no address
        mapsLink: null,
        preferredDate: new Date(preferredDate),
        whatsappNumber,
        notes: notes || null,
        status: "pending",
      },
    });

    // Try to send email notifications, but don't fail the order if email fails
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const clerkUser = await (await clerkClient()).users.getUser(clerkId);
      const userName = clerkUser.firstName || clerkUser.username || "Customer";
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";

      if (userEmail) {
        const { sendEmail, generateOrderConfirmationEmail } = await import("@/lib/email");
        await sendEmail({
          to: userEmail,
          ...generateOrderConfirmationEmail(
            userName,
            order.id,
            plan,
            address || `${subLocation}, ${region}`,
            new Date(preferredDate).toLocaleDateString()
          ),
        });
      }

      // Send notification to admin
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const { sendEmail, generateAdminOrderNotification } = await import("@/lib/email");
        await sendEmail({
          to: adminEmail,
          ...generateAdminOrderNotification(
            userName,
            clerkUser.phoneNumbers?.[0]?.phoneNumber || whatsappNumber || "N/A",
            plan,
            region,
            subLocation,
            address || `${subLocation}, ${region}`,
            new Date(preferredDate).toLocaleDateString(),
            order.id
          ),
        });
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Continue - order was created successfully
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user database ID from Clerk ID
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
