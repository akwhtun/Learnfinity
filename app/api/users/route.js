import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();

        return NextResponse.json(
            { message: "Users fetched successfully", users },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching users:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, isAdmin } = await req.json();

        // Validate input
        if (!id ) {
            return NextResponse.json(
                { error: "ID is required." },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) }, 
            data: { isAdmin },
        });

        return NextResponse.json(
            { message: "User updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}