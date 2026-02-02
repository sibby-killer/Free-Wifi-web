
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET: Fetch all templates
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();
        const templates = await prisma.messageTemplate.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(templates);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
    }
}

// POST: Create a new template
export async function POST(req: NextRequest) {
    try {
        const { auth: { userId } } = await requireAdmin();
        const body = await req.json();
        const { name, content, category } = body;

        const template = await prisma.messageTemplate.create({
            data: {
                name,
                content,
                category,
                createdBy: userId
            }
        });

        return NextResponse.json(template);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
    }
}
