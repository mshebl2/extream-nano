import { NextRequest, NextResponse } from 'next/server';
import { uploadToGridFS } from '@/lib/gridfs';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to GridFS
        const fileId = await uploadToGridFS(buffer, file.name, file.type);

        return NextResponse.json({ 
            success: true, 
            fileId,
            url: `/api/images/${fileId}`
        });
    } catch (error) {
        console.error('Failed to upload image:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}

