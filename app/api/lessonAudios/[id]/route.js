import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const lessonAudios = await prisma.audio.findMany({
            where: {
                lessonId: parseInt(id),
            },
            include: {
                lesson: true
            }
        });
        

        return NextResponse.json(
            { message: "Lessonaudios fetched successfully", lessonAudios },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching lessonAudios:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
