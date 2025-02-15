
# Food Sensi: Get Realtime information about the food you are eating.

## Problem

What am I actually eating and is it good for me?

Food Sensi addresses this concern by analyzing the food in your food and provides multiple ways to scan it depending on your preferences.

## Solution: Food Sensi

Our application stands out with its real-time, data-driven, and user-friendly features, catering to various needs:
- **Real-Time Data Collection:** Utilizing crowd-sourcing to gather and update noise data dynamically.
- **User-Driven Approach:** Empowering users to contribute to and benefit from the collective noise data.
- **Versatile Use Cases:** Ideal for anyone seeking a quiet spot, from students to homebuyers.

## Tech Stack

Our technology choices reflect our commitment to robust and efficient solutions:
- **React and Next.js:** Dynamic and responsive web application.
- **Firebase:** To allow users to store food into our database and authentication.
- **UploadThing:** To allow users to upload images to the database.
- **Clarifai:** A pre-trained AI model that analyzes food images to identify ingredients and nutritional content.
  
## The Experience

With our mobile app, users easily contribute noise data, which is visualized on maps using Google Maps and Mappedin APIs. This allows everyone from students seeking a quiet study space to PTSD sufferers needing a calm environment, to find their ideal location with ease.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
