import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const tests = await prisma.test.findMany();

        return NextResponse.json(
            { message: "Tests fetched successfully", tests },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching tests:", error.message || error);
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
        const level = form.get('level');
        const category = form.get('category')
        const file = form.get('image');
        let image = null; // Default value if no image is uploaded

        if (file) {
            const extension = path.extname(file.name); // Get file extension
            const uniqueName = `${uuidv4()}${extension}`; // Generate a unique filename
            image = uniqueName;
        }

        if (!title || !description || !level || !category) {
            return NextResponse.json(
                { error: "All title, description, level and category are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/tests/');
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
        
        const newTest = await prisma.test.create({
            data: { title, description, level, category, image },
        });
        return NextResponse.json(
            { message: "Test created successfully", test: newTest },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating test:", error.message || error);
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
        const level = form.get('level');
        const category = form.get('category')
        const file = form.get('image');

        let image = null;
        let isContainNewImage;
        if (file instanceof File) {
            isContainNewImage = true;
        } else {
            isContainNewImage = false;
        }

        // Validate input
        if (!id || !title || !description || !level || !category ) {
            return NextResponse.json(
                { error: "All id, title,description, level and category are required." },
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
                const publicDirectoryPath = path.join(process.cwd(), 'public/uploads/tests/');
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
        

    let updatedTest;
      if(isContainNewImage){
         updatedTest = await prisma.test.update({
            where: { id: parseInt(id) }, 
            data: { title,description,level,category,image  },
        });
      }else{
        updatedTest = await prisma.test.update({
            where: { id: parseInt(id) }, 
            data: { title,description,level,category  },
        });
      }

        return NextResponse.json(
            { message: "Test updated successfully", test: updatedTest },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating test:", error.message || error);
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
                { error: "Test id is required." },
                { status: 400 }
            );
        }

        await prisma.test.delete({
            where: { id: parseInt(id) }, 
        });

        return NextResponse.json(
            { message: "Test deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting test:", error.message || error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}