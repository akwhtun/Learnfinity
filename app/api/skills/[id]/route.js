import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const skill = await prisma.skill.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Skill fetched successfully", skill },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching skill:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
