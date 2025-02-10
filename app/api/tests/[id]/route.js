import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const test = await prisma.test.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Test fetched successfully", test },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching test:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
