import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const pronounciation = await prisma.pronounciation.findFirst({
            where: {
                id: parseInt(id),
            }
        });

        return NextResponse.json(
            { message: "Pronounciation fetched successfully", pronounciation },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching pronounciation:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
