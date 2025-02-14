import { NextResponse } from 'next/server';

const PAT = process.env.CLARIFAI_PAT;
const USER_ID = process.env.CLARIFAI_USER_ID;
const APP_ID = process.env.CLARIFAI_APP_ID;
const MODEL_ID = process.env.CLARIFAI_MODEL_ID;
const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { inputs } = body;

        if (!inputs?.[0]?.data?.image?.base64) {
            throw new Error('Invalid request format - missing image data');
        }

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": inputs
        });

        const response = await fetch(
            `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Key ' + PAT
                },
                body: raw
            }
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing image:', error);
        return NextResponse.json({ error: 'Error processing image' }, { status: 500 });
    }
}