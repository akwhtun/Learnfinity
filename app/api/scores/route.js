import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const scores = await prisma.progress.findMany({
            include: {
                user: true,   
                test: true    
            }
        });
        


        return NextResponse.json(
            { message: "Scores fetched successfully", scores },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching scores:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}