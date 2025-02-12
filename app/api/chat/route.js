import { NextResponse } from "next/server";
export async function POST(req, res) {
 
    const { message } = await req.json();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
            {
                "contents": [{
                    "parts": [{ "text": message }]
                }]
            }),
        });


    
        const data = await response.json();
        const aiReply = data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't understand that.";

        console.log("ai reply is",aiReply);
        
        return NextResponse.json(
            { message: "response fetched successfully", reply: aiReply },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return NextResponse.json(
            { message: "Oops! Something went wrong. Try again later." },
            { status: 500 }
        );
    }
}
