import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const testQuizes = await prisma.quiz.findMany({
            where: {
                testId: parseInt(id),
            },
            include: {
                Test: true
            }
        });
        

        return NextResponse.json(
            { message: "TestQuizes fetched successfully", testQuizes },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching testQuizes:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
