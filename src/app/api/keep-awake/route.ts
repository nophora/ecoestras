import { NextResponse } from 'next/server';

// THIS IS THE MAGIC LINE that stops Vercel from caching the response
export const dynamic = 'force-dynamic';

const API_URL = 'https://ecoestras-api.onrender.com/api';

export async function GET() {
    try {
        // This makes Vercel call your Render server
        const res = await fetch(`${API_URL}/health`, {
            cache: 'no-store'
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to wake Render" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Render pinged successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Network error pinging Render" }, { status: 500 });
    }
}




