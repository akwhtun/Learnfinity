import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const lesson = await prisma.lesson.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Lesson fetched successfully", lesson },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching lesson:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
