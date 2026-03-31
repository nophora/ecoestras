import { NextResponse } from 'next/server';

// THIS IS THE MAGIC LINE that stops Vercel from caching the response
export const dynamic = 'force-dynamic';

const API_URL = 'https://ecoestras-backend.vercel.app/api';


// Helper for generating random footprints (e.g. q7ss-29x9spq21m)
const generateFootprint = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const gen = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${gen(4)}-${gen(10)}`;
};

export async function GET() {
    try {
        // 1. Generate a fresh footprint for this specific ping
        const currentFootprint = generateFootprint();

        // 2. Fire the POST request to Render
        const res = await fetch(`${API_URL}/health`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },
            // 3. Send the unique footprint as the POST data
            body: JSON.stringify({ footprint: currentFootprint })
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to wake Render" }, { status: 500 });
        }

        // 4. Read what Render sends back
        const renderData = await res.json();

        return NextResponse.json({
            success: true,
            message: "Render pinged successfully via POST",
            renderResponse: renderData // We will display Render's response here
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Network error pinging Render" }, { status: 500 });
    }
}