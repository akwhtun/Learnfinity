import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const multipleChoice = await prisma.multipleChoice.findFirst({
            where: {
                id: parseInt(id),
            },
            include:{
                Test : true
            }
        });

        return NextResponse.json(
            { message: "MultipleChoice fetched successfully", multipleChoice },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching multipleChoice:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
