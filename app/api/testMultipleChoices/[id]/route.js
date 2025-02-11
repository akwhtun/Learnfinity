import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const testMultipleChoices = await prisma.multipleChoice.findMany({
            where: {
                testId: parseInt(id),
            },
            include: {
                Test: true
            }
        });
        

        return NextResponse.json(
            { message: "TestMultipleChoices fetched successfully", testMultipleChoices },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching testMultipleChoices:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
