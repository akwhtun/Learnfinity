import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {

    try {
        const { id } = params;
        const contact = await prisma.contact.findFirst({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json(
            { message: "Contact fetched successfully", contact },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching contact:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req,{params}) {
    try {
        const {id} = params;
        const { isRead } = await req.json();

        if (!id ) {
            return NextResponse.json(
                { error: "Id is  required." },
                { status: 400 }
            );
        }

        const updatedContact = await prisma.contact.update({
            where: { id: parseInt(id) }, 
            data: { isRead },
        });

        return NextResponse.json(
            { message: "Contact updated successfully", contact: updatedContact },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating contact:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
