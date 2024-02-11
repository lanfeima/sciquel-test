import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function GET(req: NextRequest){
    try {
        // Fetch the 50 most recent comments
        const comments = await prisma.comment.findMany({
            take: 50,
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Return the comments in the response
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the database query
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            // If it's not an Error object, handle accordingly
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    } 
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