import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const activities = await prisma.activity.findMany({
            include: {
                lesson: { include: { skill: true } },

            },
        })

        return NextResponse.json(
            { message: "Activities fetched successfully", activities },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching activities:", error.message || error);
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
        const description = form.get('description')
        const content = form.get('content');
        const lessonId = parseInt(form.get('lessonId'));
        const file = form.get('image');
        let image = null; // Default value if no image is uploaded

        if (file) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }

        if (!title || !description || !content || !lessonId) {
            return NextResponse.json(
                { error: "All title, description and content, and lessonId are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/activities/');
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
        
        const newActivity = await prisma.activity.create({
            data: { title, description, content, image, lessonId },
        });
        return NextResponse.json(
            { message: "Activity created successfully", activity: newActivity },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating activity:", error.message || error);
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
        const title = form.get('title');
        const description = form.get('description')
        const content = form.get('content');
        const lessonId = parseInt(form.get('lessonId'));
        const file = form.get('image');

        let image = null;
        let isContainNewImage;
        if (file instanceof File) {
            isContainNewImage = true;
        } else {
            isContainNewImage = false;
        }

        // Validate input
        if (!id || !title || !description || !content || !lessonId ) {
            return NextResponse.json(
                { error: "All id, title,description, content and lessonId are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/activities/');
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
        

    let updatedActivity;
      if(isContainNewImage){
         updatedActivity = await prisma.activity.update({
            where: { id: parseInt(id) }, 
            data: { title,description,content,image,lessonId  },
        });
      }else{
        updatedActivity = await prisma.activity.update({
            where: { id: parseInt(id) }, 
            data: { title,description,content,lessonId  },
        });
      }

        return NextResponse.json(
            { message: "Activity updated successfully", activity: updatedActivity },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating activity:", error.message || error);
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
                { error: "Activity id is required." },
                { status: 400 }
            );
        }

        await prisma.activity.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "Activity deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting activity:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

