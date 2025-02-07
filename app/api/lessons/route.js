import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Fetch all lessons
        const lessons = await prisma.lesson.findMany();

        return NextResponse.json(
            { message: "Lessons fetched successfully", lessons },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching lessons:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { lesson } = await req.json();

        // Validate input
        if (!lesson) {
            return NextResponse.json(
                { error: "Lesson is required." },
                { status: 400 }
            );
        }

        // Create a new lesson
        const newLesson = await prisma.lesson.create({
            data: { lesson },
        });

        return NextResponse.json(
            { message: "Lesson created successfully", lesson: newLesson },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating lesson:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, lesson } = await req.json();

        // Validate input
        if (!id || !lesson) {
            return NextResponse.json(
                { error: "Both id and lesson are required." },
                { status: 400 }
            );
        }

        // Update the lesson
        const updatedLesson = await prisma.lesson.update({
            where: { id: parseInt(id) }, // Ensure id is an integer
            data: { lesson },
        });

        return NextResponse.json(
            { message: "Lesson updated successfully", lesson: updatedLesson },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating lesson:", error.message || error);
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
                { error: "Lesson id is required." },
                { status: 400 }
            );
        }

        // Delete the lesson
        await prisma.lesson.delete({
            where: { id: parseInt(id) }, // Ensure id is an integer
        });

        return NextResponse.json(
            { message: "Lesson deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting lesson:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}