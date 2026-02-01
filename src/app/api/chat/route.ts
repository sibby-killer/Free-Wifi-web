import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are the FreeWiFi KE virtual assistant. Your job is to ANSWER QUESTIONS about our internet service, not just greet users.

ABOUT FREEWIFI KE:
- WiFi hotspot installation service in Kenya
- Locations: Kakamega (Lurambi, Koro, Milimani, Others) and Bungoma (Marel, Bridge, Kanduyi, Others)
- Plans: 
  * 10 Mbps Basic: KES 1,500/month (good for browsing & social media)
  * 12 Mbps Premium: KES 2,000/month (best for streaming & gaming)
- Router: KES 1,200 one-time fee (or FREE if you have your own router)
- Installation: FREE within our coverage areas
- Contact: WhatsApp 0762667048 or 0768294174, Email freewifiv4@gmail.com
- Support: 24/7 via WhatsApp, Email, and AI Chat

WHY WE EXIST:
In Western Kenya, internet is expensive and unreliable. Competitors charge KES 2,500/month for just 8Mbps. We partnered with Starlink to bring affordable satellite internet to Kakamega and Bungoma.

ANSWER QUESTIONS ABOUT:
1. Plans & Pricing - Explain the two plans, their speeds, and monthly costs
2. Installation - FREE installation, typically takes 1-2 days after order confirmation
3. Coverage Areas - We serve Kakamega and Bungoma regions (list specific sub-locations)
4. Router Information - KES 1,200 or free if they have their own
5. How to Order - Guide them through the ordering process on the dashboard
6. Troubleshooting:
   - Slow speeds? Try restarting router (unplug 30 seconds, plug back in)
   - No internet? Check cables are properly connected
   - Still having issues? Use @admin or report a problem via the dashboard
7. Billing - Monthly payments, no hidden fees, cancel anytime
8. Account Questions - Help with profile updates, order status, etc.

YOU CANNOT HELP WITH:
- Unrelated topics (politics, personal advice, other services)
- Technical backend issues (tell them to use @admin)
- Refunds or billing disputes (tell them to use @admin)

IMPORTANT RULES:
- DO NOT just say "Hello" or greet without answering the question
- ALWAYS directly answer what the user is asking
- If asked about plans, EXPLAIN the plans with prices and speeds
- If asked about coverage, LIST the specific areas we serve
- If unsure, admit it and suggest contacting @admin for human support
- Be friendly but INFORMATIVE - provide actual details, not just greetings
- Do NOT use emojis in your responses

TONE: Friendly, helpful, professional. Use simple English.

If user mentions @admin, acknowledge that a human will be contacted soon.`;

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
    let history: { role: string; content: string }[] = [];
    try {
      const dbHistory = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      history = dbHistory.reverse().map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    } catch (dbError) {
      console.error("Database error fetching history:", dbError);
      // Continue with empty history
    }

    // Build messages array for Groq
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      // Add history (excluding the very recent message if it was somehow fetched)
      ...history
        .filter(msg => msg.content !== message)
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      // Explicitly add current user message at the end
      { role: "user" as const, content: message }
    ];

    // Call Groq API
    let aiResponse = "I'm sorry, I couldn't process that. Please try again or use @admin for human support.";

    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      try {
        const groq = new Groq({ apiKey: groqApiKey });
        const completion = await groq.chat.completions.create({
          messages,
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 500,
        });

        aiResponse = completion.choices[0]?.message?.content || aiResponse;
      } catch (groqError) {
        console.error("Groq API error:", groqError);
        aiResponse = "I'm having trouble connecting to my AI service right now. Please try again in a moment, or use @admin to get human support.";
      }
    } else {
      console.error("GROQ_API_KEY not set");
      aiResponse = "AI service is not configured. Please use @admin to get human support.";
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
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const user = await (await clerkClient()).users.getUser(userId);
        const userName = user.firstName || user.username || "Customer";
        const userEmail = user.emailAddresses[0]?.emailAddress || "";

        const adminEmail = process.env.ADMIN_EMAIL;
        if (adminEmail) {
          const { sendEmail, generateAdminMentionNotification } = await import("@/lib/email");
          await sendEmail({
            to: adminEmail,
            ...generateAdminMentionNotification(
              userName,
              user.username || "unknown",
              userEmail,
              "Location unknown",
              message,
              new Date().toLocaleString()
            ),
          });
        }
      } catch (emailError) {
        console.error("Admin notification email failed:", emailError);
        // Continue - chat still works
      }
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

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let messages: { id: string; role: string; content: string; createdAt: Date; mentionAdmin: boolean }[] = [];
    try {
      messages = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "asc" },
        take: 100,
      });
    } catch (dbError) {
      console.error("Database error fetching messages:", dbError);
      // Return empty array if database fails
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
