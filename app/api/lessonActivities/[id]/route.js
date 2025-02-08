import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const lessonActivities = await prisma.activity.findMany({
            where: {
                lessonId: parseInt(id),
            },
            include: {
                lesson: true
            }
        });
        

        return NextResponse.json(
            { message: "Lessonactivities fetched successfully", lessonActivities },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching lessonActivities:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
