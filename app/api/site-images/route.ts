import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import connectDB from '@/lib/db';
import SiteImage from '@/models/SiteImage';

export const dynamic = 'force-dynamic';

// Cached site images
const getCachedSiteImages = unstable_cache(
    async () => {
        await connectDB();
        const images = await SiteImage.find().lean();
        return images.map((image: any) => ({
            ...image,
            _id: image._id.toString(),
            url: image.imageFileId ? `/api/images/${image.imageFileId}` : image.url,
        }));
    },
    ['site-images-list'],
    { revalidate: 60, tags: ['site-images'] } // 1 minute for faster updates
);

export async function GET() {
    try {
        const images = await getCachedSiteImages();
        return NextResponse.json(images, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Failed to fetch site images:', error);
        return NextResponse.json({ error: 'فشل في جلب صور الموقع' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { key, url, imageFileId, label, description, section } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
        }

        // Check if image exists
        const existing = await SiteImage.findOne({ key }).lean();
        
        const updateData: any = { 
            updatedAt: new Date() 
        };
        
        // If imageFileId is provided, use it and construct URL
        if (imageFileId) {
            updateData.imageFileId = imageFileId;
            updateData.url = `/api/images/${imageFileId}`;
        } else if (url) {
            updateData.url = url;
            // Clear imageFileId if we're using a URL instead
            updateData.imageFileId = null;
        }
        
        // Preserve or update other fields
        if (label) updateData.label = label;
        if (description !== undefined) updateData.description = description;
        if (section) updateData.section = section;
        
        // If upserting and fields are missing, use defaults from existing or set defaults
        if (!existing) {
            if (!updateData.label) updateData.label = key;
            if (!updateData.section) updateData.section = 'عام';
            updateData.createdAt = new Date();
        }

        const image = await SiteImage.findOneAndUpdate(
            { key },
            updateData,
            { new: true, upsert: true }
        ).lean();

        // Invalidate cache
        revalidateTag('site-images', 'max');
        // Also revalidate the home page and other pages that use site images
        revalidateTag('services', 'max');
        revalidateTag('blogs', 'max');

        return NextResponse.json({
            ...image,
            _id: (image as any)._id.toString(),
            url: (image as any).imageFileId ? `/api/images/${(image as any).imageFileId}` : (image as any).url,
        });
    } catch (error) {
        console.error('Failed to update site image:', error);
        return NextResponse.json({ error: 'فشل في تحديث الصورة' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { key, url, imageFileId, label, description, section } = body;

        if (!key) {
            return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
        }

        // Construct URL from imageFileId if provided
        const imageUrl = imageFileId ? `/api/images/${imageFileId}` : url;

        const image = await SiteImage.create({
            key,
            url: imageUrl,
            imageFileId,
            label,
            description,
            section,
            createdAt: new Date(),
            updatedAt: new Date(),
        }) as any;

        // Invalidate cache
        revalidateTag('site-images', 'max');

        return NextResponse.json({
            ...image.toObject(),
            _id: image._id.toString(),
            url: image.imageFileId ? `/api/images/${image.imageFileId}` : image.url,
        }, { status: 201 });
    } catch (error) {
        console.error('Failed to create site image:', error);
        return NextResponse.json({ error: 'فشل في إنشاء الصورة' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
        }

        await SiteImage.findOneAndDelete({ key });

        // Invalidate cache
        revalidateTag('site-images', 'max');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete site image:', error);
        return NextResponse.json({ error: 'فشل في حذف الصورة' }, { status: 500 });
    }
}
