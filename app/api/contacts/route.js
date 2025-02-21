import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany();

        return NextResponse.json(
            { message: "Contacts fetched successfully", contacts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching contacts:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { name, email, content, isRead } = await req.json();

        // Validate input
        if (!content) {
            return NextResponse.json(
                { error: "Content is required." },
                { status: 400 }
            );
        }

        const newContent = await prisma.contact.create({
            data: { name,email,content,isRead },
        });

        return NextResponse.json(
            { message: "Contact created successfully", contact: newContent },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating contact:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}