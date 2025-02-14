import type { NextApiRequest, NextApiResponse } from 'next';

// pages/api/predict.ts


const PAT = "463fa30e272843b390d69703f9998e85";
const USER_ID = "clarifai";
const APP_ID = "main";
const MODEL_ID = "food-item-recognition";
const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";
const IMAGE_URL = "https://www.halfbakedharvest.com/wp-content/uploads/2024/04/30-Minute-Honey-Garlic-Chicken-1.jpg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: IMAGE_URL,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Key " + PAT,
        },
        body: raw,
    };

    try {
        const response = await fetch(
            "https://api.clarifai.com/v2/models/" +
                MODEL_ID +
                "/versions/" +
                MODEL_VERSION_ID +
                "/outputs",
            requestOptions
        );
        const result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching prediction' });
    }
}
