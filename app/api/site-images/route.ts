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
    { revalidate: 14400, tags: ['site-images'] } // 4 hours
);

export async function GET() {
    try {
        const images = await getCachedSiteImages();
        return NextResponse.json(images);
    } catch (error) {
        console.error('Failed to fetch site images:', error);
        return NextResponse.json({ error: 'فشل في جلب صور الموقع' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { key, url, imageFileId } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'المفتاح مطلوب' }, { status: 400 });
        }

        const updateData: any = { url, updatedAt: new Date() };
        if (imageFileId) {
            updateData.imageFileId = imageFileId;
        }

        const image = await SiteImage.findOneAndUpdate(
            { key },
            updateData,
            { new: true, upsert: true }
        ).lean();

        // Invalidate cache
        revalidateTag('site-images', 'max');

        return NextResponse.json({
            ...image,
            _id: (image as any)._id.toString(),
        });
    } catch (error) {
        console.error('Failed to update site image:', error);
        return NextResponse.json({ error: 'فشل في تحديث الصورة' }, { status: 500 });
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
