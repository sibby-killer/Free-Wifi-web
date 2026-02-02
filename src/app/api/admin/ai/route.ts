
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { message, context } = await req.json();

        // Simulate AI processing delay
        await new Promise(r => setTimeout(r, 1000));

        // Logic to classify question type (Network vs Draft)
        const lowerMsg = message.toLowerCase();
        let response = "";

        if (lowerMsg.includes("slow") || lowerMsg.includes("down") || lowerMsg.includes("connect")) {
            response = "**Network Troubleshooting Guide:**\n1. Check router lights (LOS should be off).\n2. Verify fiber patch cord connection.\n3. Restart the router.\n4. Check Optical Power using the admin tool.\n\n*Draft Reply:* 'Hello, sorry for the trouble. Please restart your router and check if the LOS light is blinking Red. Let us know so we can dispatch a technician if needed.'";
        } else if (lowerMsg.includes("pay") || lowerMsg.includes("mpesa")) {
            response = "**Payment Response Draft:**\n'Thank you for your payment! It has been received and your plan is active. If you don't see changes, please refresh your device.'";
        } else {
            response = "I am the Admin Assistant. I can help with:\n- Network Troubleshooting tips\n- Drafting customer responses\n- Explaining technical errors\n\n*Ask me about specific issues like 'customer says internet is slow' or 'draft a payment reminder'.*";
        }

        return NextResponse.json({ reply: response });

    } catch (error) {
        return NextResponse.json({ error: "AI Service Unavailable" }, { status: 500 });
    }
}
