import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";
import { env } from "@/lib/env";

const groq = new Groq({ apiKey: env.server.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are the FreeWiFi KE virtual assistant.

ABOUT THE COMPANY:
- WiFi hotspot installation service in Kenya
- Locations: Kakamega (Lurambi, Koro, Milimani) and Bungoma (Marel, Bridge, Kanduyi)
- Plans: 10 Mbps at KES 1,500/month, 12 Mbps at KES 2,000/month
- Contact: WhatsApp 0762667048 or 0768294174, Email freewifiv4@gmail.com
- Router: KES 1,200 (one-time) or FREE if you have your own
- Installation: FREE within coverage areas
- Support: 24/7 via WhatsApp, Email, AI Chat

The Problem:
In Western Kenya, internet is expensive and unreliable. Our competitors charge KES 2,500/month for just 8Mbps. Many families, students, and small businesses simply cannot afford it.

We started FreeWiFi KE to change that. We partnered with Starlink to bring satellite internet to Kakamega and Bungoma at prices everyone can afford.

YOU CAN HELP WITH:
- Explaining plans and pricing
- Installation process and timeline
- Coverage area questions
- Basic troubleshooting (restart router, check cables, speed issues)
- Account and billing inquiries
- Directing users to order or report problems

YOU CANNOT HELP WITH:
- Anything unrelated to FreeWiFi KE
- Technical backend issues (tell them to @admin)
- Refunds or billing disputes (tell them to @admin)
- Personal advice unrelated to the service

TONE: Friendly, helpful, professional. Use simple English. Occasionally use emojis.

If user mentions @admin, acknowledge that a human will be contacted.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // Check if message contains @admin
    const mentionAdmin = message.toLowerCase().includes("@admin");

    // Save user message (using Clerk userId directly)
    try {
      await prisma.chatMessage.create({
        data: {
          userId,
          role: "user",
          content: message,
          mentionAdmin,
        },
      });
    } catch (dbError) {
      console.error("Database error saving message:", dbError);
      // Continue anyway - we can still chat without saving history
    }

    // Get chat history for context (last 10 messages)
    const history = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Build messages array for Groq
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.reverse().map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Call Groq API
    let aiResponse = "I'm sorry, I couldn't process that.";
    try {
      const completion = await groq.chat.completions.create({
        messages: messages as any,
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 500,
      });

      aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    } catch (groqError: any) {
      console.error("Groq API error:", groqError);
      // Fallback response if Groq fails
      aiResponse = "I'm having trouble connecting to my AI service right now. Please try again in a moment, or use @admin to get human support.";
    }

    // Save AI response
    try {
      await prisma.chatMessage.create({
        data: {
          userId,
          role: "assistant",
          content: aiResponse,
          mentionAdmin: false,
        },
      });
    } catch (dbError) {
      console.error("Database error saving AI response:", dbError);
      // Continue anyway - user still gets the response
    }

    // If @admin was mentioned, send notification email
    if (mentionAdmin) {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const user = await (await clerkClient()).users.getUser(userId);
      const userName = user.firstName || user.username || "Customer";
      const userEmail = user.emailAddresses[0]?.emailAddress || "";
      
      const { sendEmail, generateAdminMentionNotification } = await import("@/lib/email");
      await sendEmail({
        to: env.server.ADMIN_EMAIL,
        ...generateAdminMentionNotification(
          userName,
          user.username || "unknown",
          userEmail,
          "Location unknown", // TODO: Get from user profile
          message,
          new Date().toLocaleString()
        ),
      });
    }

    return NextResponse.json({ 
      response: aiResponse,
      mentionAdmin 
    });
  } catch (error) {
    console.error("Error in chat:", error);
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

    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
