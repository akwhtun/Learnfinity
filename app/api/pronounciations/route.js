import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {

    try {
        const pronounciations = await prisma.pronounciation.findMany({});

        return NextResponse.json(
            { message: "Pronounciations fetched successfully", pronounciations },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching pronounciations:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const form = await req.formData();

        const text = form.get('text');
        const file = form.get('image');
        let image = null; 

        if (file) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }

        if (!text) {
            return NextResponse.json(
                { error: "Text is required." },
                { status: 400 }
            );
        }

        if (file) {
            let fileToSave;
            form.forEach((value, key) => {
                if (value instanceof File) {
                    console.log("value of file", value);

                    fileToSave = value;
                } else {
                    console.log(`${key}: ${value}`);
                }
            });
            if (fileToSave) {
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/pronounciations/');
                if (!fs.existsSync(publicDirectoryPath)) {
                    fs.mkdirSync(publicDirectoryPath, { recursive: true });
                }

                // Get the file's buffer
                const fileBuffer = Buffer.from(await fileToSave.arrayBuffer());

                // Define the full path to save the file inside 'public/uploads/article'
                const filePath = path.join(publicDirectoryPath, image);

                fs.writeFileSync(filePath, fileBuffer);

                console.log(`File saved to: ${filePath}`);
            }

        }
        
        const newPronounciation = await prisma.pronounciation.create({
            data: { text, image },
        });
        return NextResponse.json(
            { message: "Pronounciation created successfully", pronounciation: newPronounciation },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating pronounciation:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        const form = await req.formData();
        const id = form.get('id')
        const text = form.get('text')
        const file = form.get('image');

        let image = null;
        let isContainNewImage;
        if (file instanceof File) {
            isContainNewImage = true;
        } else {
            isContainNewImage = false;
        }


        // Validate input
        if (!text ) {
            return NextResponse.json(
                { error: "Text is required." },
                { status: 400 }
            );
        }

        if (isContainNewImage) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }
        if (isContainNewImage) {
            let fileToSave;
            form.forEach((value, key) => {
                if (value instanceof File) {
                    console.log("value of file", value);

                    fileToSave = value;
                } else {
                    console.log(`${key}: ${value}`);
                }
            });
            if (fileToSave) {
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/pronounciations/');
                if (!fs.existsSync(publicDirectoryPath)) {
                    fs.mkdirSync(publicDirectoryPath, { recursive: true });
                }

                // Get the file's buffer
                const fileBuffer = Buffer.from(await fileToSave.arrayBuffer());

                // Define the full path to save the file inside 'public/uploads/article'
                const filePath = path.join(publicDirectoryPath, image);

                // Write the file to the 'public/uploads/article' directory
                fs.writeFileSync(filePath, fileBuffer);

                console.log(`File saved to: ${filePath}`);
            }

        }
        
    let updatedPronounciation;
      if(isContainNewImage){
         updatedPronounciation = await prisma.pronounciation.update({
            where: { id: parseInt(id) }, 
            data: { text,image },
        });
      }else{
        updatedPronounciation = await prisma.pronounciation.update({
            where: { id: parseInt(id) }, 
            data: { text },
        });
      }

        return NextResponse.json(
            { message: "Pronounciation updated successfully", pronounciation: updatedPronounciation },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating pronounciation:", error.message || error);
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
                { error: "pronounciation id is required." },
                { status: 400 }
            );
        }

        await prisma.pronounciation.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "pronounciation deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting pronounciation:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}