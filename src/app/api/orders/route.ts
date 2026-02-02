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

    // Check Admin
    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerkUser = await (await clerkClient()).users.getUser(clerkId);
    const role = clerkUser.publicMetadata?.role as string | undefined;
    const isAdmin = role === "admin";

    let orders;

    if (isAdmin) {
      orders = await prisma.order.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Get user database ID from Clerk ID
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true }
      });
      if (!user) {
        return NextResponse.json({ orders: [] });
      }
      orders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }

  // PUT: Admin updates order status
  export async function PUT(req: NextRequest) {
    try {
      const { user } = await requireAdmin();
      const body = await req.json();
      const { orderId, status } = body;

      if (!orderId || !status) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }

      // Update Order
      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status, adminNotes: `Updated by ${user.emailAddresses[0]?.emailAddress}` },
        include: { user: true }
      });

      // If completed, update User Profile & Create Notification
      if (status === "completed") {
        const renewalDate = new Date();
        renewalDate.setDate(renewalDate.getDate() + 30); // 30 days

        await prisma.user.update({
          where: { id: updatedOrder.userId },
          data: {
            currentPlan: updatedOrder.plan,
            renewalDate: renewalDate
          }
        });

        await prisma.notification.create({
          data: {
            title: "Order Completed! ✅",
            message: `Your ${updatedOrder.plan} is now active. Renewal date: ${renewalDate.toDateString()}.`,
            type: "success",
            userId: updatedOrder.userId,
            isGlobal: false
          }
        });
      }

      return NextResponse.json({ success: true, order: updatedOrder });

    } catch (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Unauthorized or Error" }, { status: 500 });
    }
  }


