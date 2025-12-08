import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

// Cached blogs list
const getCachedBlogs = unstable_cache(
    async () => {
        await connectDB();
        const blogs = await Blog.find().sort({ createdAt: -1 }).lean();
        return blogs.map((blog: any) => ({
            ...blog,
            _id: blog._id.toString(),
        }));
    },
    ['blogs-list'],
    { revalidate: 14400, tags: ['blogs'] } // 4 hours
);

export async function GET() {
    try {
        const blogs = await getCachedBlogs();
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ error: 'فشل في جلب المقالات' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const blog = await Blog.create(body) as any;

        // Invalidate cache
        revalidateTag('blogs', 'max');

        const blogObj = {
            ...blog.toObject(),
            _id: blog._id.toString(),
        };

        return NextResponse.json(blogObj, { status: 201 });
    } catch (error) {
        console.error('Failed to create blog:', error);
        return NextResponse.json({ error: 'فشل في إنشاء المقال' }, { status: 500 });
    }
}
