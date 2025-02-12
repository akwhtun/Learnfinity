import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { userId, testId, score } = await req.json();

        if (!userId || !testId || !score) {
            return NextResponse.json(
                { error: "Both UserId, testId and score are required." },
                { status: 400 }
            );
        }

        const newProgress = await prisma.progress.create({
            data: { userId, testId, score },
        });

        return NextResponse.json(
            { message: "Progress created successfully", progress: newProgress },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating progress:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}