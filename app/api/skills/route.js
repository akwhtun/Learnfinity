import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const skills = await prisma.skill.findMany();

        return NextResponse.json(
            { message: "Skills fetched successfully", skills },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching skills:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { title, description } = await req.json();

        // Validate input
        if (!title || !description) {
            return NextResponse.json(
                { error: "Both title and description are required." },
                { status: 400 }
            );
        }

        // Create a new skill
        const newSkill = await prisma.skill.create({
            data: { title, description },
        });

        return NextResponse.json(
            { message: "Skill created successfully", skill: newSkill },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating skill:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, title, description } = await req.json();

        // Validate input
        if (!id || !title || !description) {
            return NextResponse.json(
                { error: "All id, title and description are required." },
                { status: 400 }
            );
        }

        // Update the skill
        const updatedSkill = await prisma.skill.update({
            where: { id: parseInt(id) }, 
            data: { title, description },
        });

        return NextResponse.json(
            { message: "Skill updated successfully", skill: updatedSkill },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating skill:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        // Validate input
        if (!id) {
            return NextResponse.json(
                { error: "Skill id is required." },
                { status: 400 }
            );
        }

        // Delete the skill
        await prisma.skill.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "Skill deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting skill:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}