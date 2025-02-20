import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const vocabulary = await prisma.vocabulary.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                activity: true
            }
        });
        

        return NextResponse.json(
            { message: "Vocabulary fetched successfully", vocabulary },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching vocabulary:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
