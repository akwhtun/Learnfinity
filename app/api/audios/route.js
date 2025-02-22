import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const audios = await prisma.audio.findMany({
            include: {
                lesson: { include: { skill: true } },

            },
        })

        return NextResponse.json(
            { message: "Audios fetched successfully", audios },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching audios:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const form = await req.formData();

        const title = form.get('title');
        const description = form.get('description');
        const lessonId = parseInt(form.get('lessonId'));
        const audioFile = form.get('audio');
        const imageFile = form.get('image');

        if (!title || !description || !lessonId || !audioFile || !imageFile) {
            return NextResponse.json(
                { error: "All fields (title, description, audio, image, and lessonId) are required." },
                { status: 400 }
            );
        }

        // Generate unique filenames
        const audioExtension = path.extname(audioFile.name);
        const audioUniqueName = `${uuidv4()}${audioExtension}`;
        const imageExtension = path.extname(imageFile.name);
        const imageUniqueName = `${uuidv4()}${imageExtension}`;

        // Save audio file
        const audioDirectoryPath = path.join(process.cwd(), 'public/uploads/audios');
        if (!fs.existsSync(audioDirectoryPath)) {
            fs.mkdirSync(audioDirectoryPath, { recursive: true });
        }
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
        const audioFilePath = path.join(audioDirectoryPath, audioUniqueName);
        fs.writeFileSync(audioFilePath, audioBuffer);
        console.log(`Audio file saved to: ${audioFilePath}`);

        // Save image file
        const imageDirectoryPath = path.join(process.cwd(), 'public/uploads/audioImages');
        if (!fs.existsSync(imageDirectoryPath)) {
            fs.mkdirSync(imageDirectoryPath, { recursive: true });
        }
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const imageFilePath = path.join(imageDirectoryPath, imageUniqueName);
        fs.writeFileSync(imageFilePath, imageBuffer);
        console.log(`Image file saved to: ${imageFilePath}`);

        // Create audio record in the database
        const newAudio = await prisma.audio.create({
            data: {
                title,
                description,
                audio: audioUniqueName,
                image: imageUniqueName,
                lessonId,
            },
        });

        return NextResponse.json(
            { message: "Audio created successfully", audio: newAudio },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating audio:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
export async function PUT(req) {
    try {
        const form = await req.formData();

        const id = form.get('id');
        const title = form.get('title');
        const description = form.get('description');
        const lessonId = parseInt(form.get('lessonId'));
        const audioFile = form.get('audio');
        const imageFile = form.get('image');

        if (!id || !title || !description || !lessonId) {
            return NextResponse.json(
                { error: "All fields (id, title, description, and lessonId) are required." },
                { status: 400 }
            );
        }

        let audioUniqueName = null;
        let imageUniqueName = null;

        // Handle audio file upload
        if (audioFile instanceof File) {
            const audioExtension = path.extname(audioFile.name);
            audioUniqueName = `${uuidv4()}${audioExtension}`;
            const audioDirectoryPath = path.join(process.cwd(), 'public/uploads/audios');
            if (!fs.existsSync(audioDirectoryPath)) {
                fs.mkdirSync(audioDirectoryPath, { recursive: true });
            }
            const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
            const audioFilePath = path.join(audioDirectoryPath, audioUniqueName);
            fs.writeFileSync(audioFilePath, audioBuffer);
            console.log(`Audio file saved to: ${audioFilePath}`);
        }

        // Handle image file upload
        if (imageFile instanceof File) {
            const imageExtension = path.extname(imageFile.name);
            imageUniqueName = `${uuidv4()}${imageExtension}`;
            const imageDirectoryPath = path.join(process.cwd(), 'public/uploads/audioImages');
            if (!fs.existsSync(imageDirectoryPath)) {
                fs.mkdirSync(imageDirectoryPath, { recursive: true });
            }
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const imageFilePath = path.join(imageDirectoryPath, imageUniqueName);
            fs.writeFileSync(imageFilePath, imageBuffer);
            console.log(`Image file saved to: ${imageFilePath}`);
        }

        // Prepare data for update
        const updateData = {
            title,
            description,
            lessonId,
        };

        if (audioUniqueName) {
            updateData.audio = audioUniqueName;
        }

        if (imageUniqueName) {
            updateData.image = imageUniqueName;
        }

        // Update the audio record in the database
        const updatedAudio = await prisma.audio.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        return NextResponse.json(
            { message: "Audio updated successfully", audio: updatedAudio },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating audio:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Audio id is required." },
                { status: 400 }
            );
        }

        await prisma.audio.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json(
            { message: "Audio deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting audio:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

