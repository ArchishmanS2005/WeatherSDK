import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://weathersdk.onrender.com';

    return NextResponse.json({
        apiUrl,
        envVar: process.env.NEXT_PUBLIC_API_URL,
        vercelUrl: process.env.VERCEL_URL,
        nodeEnv: process.env.NODE_ENV,
    });
}
