import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const quizes = await prisma.quiz.findMany();

        return NextResponse.json(
            { message: "Quizes fetched successfully", quizes },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching quizes:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const form = await req.formData();

        const sentence = form.get('sentence');
        const quizWord = form.get('quizWord')
        const wordSplit = parseInt(form.get('wordSplit'));
        const testId = parseInt(form.get('testId'))
        const file = form.get('image');
        let image = null; 

        if (file) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }

        if (!sentence || !quizWord || !wordSplit || !testId) {
            return NextResponse.json(
                { error: "All sentence, quizWord, wordSplit and testId are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/quizes/');
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
        
        const newQuiz = await prisma.quiz.create({
            data: { sentence, quizWord, wordSplit, testId, image },
        });
        return NextResponse.json(
            { message: "Quiz created successfully", quiz: newQuiz },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating quiz:", error.message || error);
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
        const sentence = form.get('sentence');
        const quizWord = form.get('quizWord')
        const wordSplit =parseInt(form.get('wordSplit'));
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
        if (!id || !sentence || !quizWord || !wordSplit || !testId ) {
            return NextResponse.json(
                { error: "All id, sentence, quizWord, wordSplit and testId  are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/quizes/');
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
        
    let updatedQuiz;
      if(isContainNewImage){
         updatedQuiz = await prisma.quiz.update({
            where: { id: parseInt(id) }, 
            data: { sentence,quizWord, wordSplit,testId,image  },
        });
      }else{
        updatedQuiz = await prisma.quiz.update({
            where: { id: parseInt(id) }, 
            data: { sentence,quizWord, wordSplit,testId },
        });
      }

        return NextResponse.json(
            { message: "Quiz updated successfully", quiz: updatedQuiz },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating quiz:", error.message || error);
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
                { error: "Quiz id is required." },
                { status: 400 }
            );
        }

        await prisma.quiz.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "Quiz deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting quiz:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}