import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const vocabularies = await prisma.vocabulary.findMany({
            include:{
                activity: true
            }
        });

        return NextResponse.json(
            { message: "Vocabularies fetched successfully", vocabularies },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching vocabulary:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { englishWord,myanmarMeaning, emoji,speech, activityId} = await req.json();

        // Validate input
        if (!englishWord || !myanmarMeaning || !emoji || !speech || !activityId) {
            return NextResponse.json(
                { error: "Both englishWord,myanmarMeaning,emoji, activityId and speech are required." },
                { status: 400 }
            );
        }


        const activityInt = parseInt(activityId) 

        const newVocabulary = await prisma.vocabulary.create({
            data: { englishWord, myanmarMeaning, emoji, speech, activityId:activityInt },
        });

        return NextResponse.json(
            { message: "Vocabulary created successfully", vocabulary: newVocabulary },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating vocabulary:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, englishWord, myanmarMeaning, emoji, speech, activityId } = await req.json();

        // Validate input
        if (!id || !englishWord || !myanmarMeaning || !emoji || !speech || !activityId) {
            return NextResponse.json(
                { error: "All id,englishWord,myanmarMeaning,emoj, speech and activityId are required." },
                { status: 400 }
            );
        }

        const updateVocabulary = await prisma.vocabulary.update({
            where: { id: parseInt(id) }, 
            data: { englishWord,myanmarMeaning, emoji, speech,activityId },
        });

        return NextResponse.json(
            { message: "Vocabulary updated successfully", vocabulary: updateVocabulary },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating vocablary:", error.message || error);
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
                { error: "Vocabulary id is required." },
                { status: 400 }
            );
        }

        await prisma.vocabulary.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "Vocabulary deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting vocabulary:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}