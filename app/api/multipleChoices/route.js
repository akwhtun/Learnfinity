import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const multipleChoices = await prisma.multipleChoice.findMany();

        return NextResponse.json(
            { message: "MultipleChoices fetched successfully", multipleChoices },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching multipleChoices:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const form = await req.formData();

        const question = form.get('question');
        const answer = form.get('answer')
        const otherWords = form.get('otherWords')
        const testId = parseInt(form.get('testId'))
        const file = form.get('image');
        let image = null; 

        if (file) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }

        if (!question || !answer || !otherWords || !testId) {
            return NextResponse.json(
                { error: "All question, answer, otherWords and testId are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/multipleChoices/');
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
        
        const newMultipleChoice = await prisma.multipleChoice.create({
            data: { question, answer, otherWords, testId, image },
        });
        return NextResponse.json(
            { message: "MultipleChoice created successfully", multipleChoice: newMultipleChoice },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating multipleChoice:", error.message || error);
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
        const question = form.get('question');
        const answer = form.get('answer')
        const otherWords = form.get('otherWords')
        const testId = parseInt(form.get('testId'))
        const file = form.get('image');

        let image = null;
        let isContainNewImage;
        if (file instanceof File) {
            isContainNewImage = true;
        } else {
            isContainNewImage = false;
        }

        // Validate input
        if (!id || !question || !answer || !otherWords || !testId ) {
            return NextResponse.json(
                { error: "All id, question, answer, otherWords and testId  are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/multipleChoices/');
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
        
    let updateMultipleChoice;
      if(isContainNewImage){
         updateMultipleChoice = await prisma.multipleChoice.update({
            where: { id: parseInt(id) }, 
            data: { question,answer,otherWords,testId,image  },
        });
      }else{
        updateMultipleChoice = await prisma.multipleChoice.update({
            where: { id: parseInt(id) }, 
            data: { question,answer,otherWords,testId  },
        });
      }

        return NextResponse.json(
            { message: "MultipleChoice updated successfully", multipleChoice: updateMultipleChoice },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating multipleChoice:", error.message || error);
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
                { error: "MultipleChoice id is required." },
                { status: 400 }
            );
        }

        await prisma.multipleChoice.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "MultipleChoice deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting multipleChoice:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}