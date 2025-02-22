import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const audio = await prisma.audio.findFirst({
            where: {
                id: parseInt(id),
            },
            include: {
                lesson: {
                    include: {
                        skill: true
                    }
                }
            }
        });
        

        return NextResponse.json(
            { message: "audio fetched successfully", audio },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching audio:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
