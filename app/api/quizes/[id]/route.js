import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const quiz = await prisma.quiz.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Quiz fetched successfully", quiz },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching quiz:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
