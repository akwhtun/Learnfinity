import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const activity = await prisma.activity.findFirst({
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
            { message: "Activity fetched successfully", activity },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching activity:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
