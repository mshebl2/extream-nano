import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import InternalLinkMapping from '@/models/InternalLinkMapping';

export async function GET() {
    await connectDB();
    try {
        // Get all link mappings, sorted by priority (descending)
        const mappings = await InternalLinkMapping.find().sort({ priority: -1, createdAt: -1 });
        return NextResponse.json(mappings);
    } catch (error) {
        console.error('Error fetching link mappings:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const {
            keyword,
            keywordAr = '',
            url,
            priority = 0,
            caseSensitive = false,
            maxOccurrences = 1,
            isActive = true,
            description = '',
        } = body;

        // Validation
        if (!keyword || keyword.trim().length === 0) {
            return NextResponse.json({ message: 'Keyword is required' }, { status: 400 });
        }

        if (!url || url.trim().length === 0) {
            return NextResponse.json({ message: 'URL is required' }, { status: 400 });
        }

        // Check if keyword already exists
        const existingMapping = await InternalLinkMapping.findOne({ keyword });
        if (existingMapping) {
            return NextResponse.json({ message: 'A mapping with this keyword already exists' }, { status: 400 });
        }

        const mapping = new InternalLinkMapping({
            keyword: keyword.trim(),
            keywordAr: keywordAr?.trim() || '',
            url: url.trim(),
            priority,
            caseSensitive,
            maxOccurrences,
            isActive,
            description,
        });

        await mapping.save();

        return NextResponse.json(mapping, { status: 201 });
    } catch (error: any) {
        console.error('Error creating link mapping:', error);
        if (error.code === 11000) {
            return NextResponse.json({ message: 'A mapping with this keyword already exists' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
