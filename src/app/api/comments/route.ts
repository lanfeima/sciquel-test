import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET(req: NextRequest){

    return NextResponse.json({ test: "success", }, { status: 200 })
}

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON body
        const body = await req.json();
        
        // Extract and validate the necessary fields
        const { name, email, content } = body;
        if (!name || !email || !content) {
            return new NextResponse(JSON.stringify({ error: "Missing name, email, or comment content" }), { status: 400 });
        }

        // Create the comment in the database
        const comment = await prisma.comment.create({
            data: {
                name,
                email,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Return the created comment
        return new NextResponse(JSON.stringify(comment), { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        } else {
            // If it's not an Error object
            return new NextResponse(JSON.stringify({ error: 'An unexpected error occurred' }), { status: 500 });
        }
    }
}