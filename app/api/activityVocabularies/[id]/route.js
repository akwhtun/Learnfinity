import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const activityVocabularies = await prisma.vocabulary.findMany({
            where: {
                activityId: parseInt(id),
            },
            include: {
                activity: true
            }
        });
        

        return NextResponse.json(
            { message: "ActivityVocabularies fetched successfully", activityVocabularies },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching activityVocabularies:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
