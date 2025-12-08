import { NextRequest, NextResponse } from 'next/server';
import { getFromGridFS } from '@/lib/gridfs';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const file = await getFromGridFS(id);

        if (!file) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Create a proper Uint8Array from the buffer for Response compatibility
        const uint8Array = new Uint8Array(file.buffer);

        return new Response(uint8Array as unknown as BodyInit, {
            headers: {
                'Content-Type': file.contentType,
                'Cache-Control': 'public, max-age=14400, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        console.error('Failed to get image:', error);
        return NextResponse.json({ error: 'Failed to get image' }, { status: 500 });
    }
}
