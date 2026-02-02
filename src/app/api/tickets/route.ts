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
    const { problemType, description, urgency } = body;

    // Validate required fields
    if (!problemType || !description || !urgency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get User from DB
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        userId: dbUser.id,
        problemType,
        description,
        urgency,
        status: "open",
      },
    });

    // Send email notification to admin
    const { clerkClient } = await import("@clerk/nextjs/server");
    const user = await (await clerkClient()).users.getUser(userId);
    const userName = user.firstName || user.username || "Customer";

    const { sendEmail, generateTicketNotification } = await import("@/lib/email");
    const { env } = await import("@/lib/env");
    await sendEmail({
      to: env.server.ADMIN_EMAIL,
      ...generateTicketNotification(
        userName,
        problemType,
        description,
        urgency,
        ticket.id
      ),
    });

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Check if Admin
    // We need to fetch user role. 
    // Assuming we can use clerkClient or check DB admin list from env?
    // Let's use DB User email check like in auth.ts or just check if user is in "Admin" list.
    // auth.ts requiresAdmin checks Metadata.
    // Here we can use Metadata.

    // Better: Helper function
    const { clerkClient } = await import("@clerk/nextjs/server");
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const role = clerkUser.publicMetadata?.role as string | undefined;
    const isAdmin = role === "admin";

    let tickets;

    if (isAdmin) {
      tickets = await prisma.ticket.findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" }
      });
    } else {
      tickets = await prisma.ticket.findMany({
        where: { userId }, // This assumes userId is Clerk ID? NO. 
        // schema says: userId String (and relation to User model). 
        // So ticket.userId is DB ID. 
        // auth() returns Clerk ID.
        // We must find DB ID first.
        include: { user: true },
        orderBy: { createdAt: "desc" }
      });
      // Wait, the "else" block above FAILED to find DB ID first.
      // I need to find DB user.
    }

    if (!isAdmin) {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (!dbUser) return NextResponse.json({ tickets: [] });
      tickets = await prisma.ticket.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" }
      });
    }


    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
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

    const { ticketId, status, adminNotes } = await req.json();

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status, adminNotes }
    });

    // Notify User? (Whatsapp/Email)

    return NextResponse.json({ success: true, ticket: updated });

  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
