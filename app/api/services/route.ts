import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

export const dynamic = 'force-dynamic';

// Cached services list
const getCachedServices = unstable_cache(
    async () => {
        await connectDB();
        const services = await Service.find().sort({ order: 1, createdAt: -1 }).lean();
        return services.map((service: any) => ({
            ...service,
            _id: service._id.toString(),
        }));
    },
    ['services-list'],
    { revalidate: 14400, tags: ['services'] } // 4 hours
);

export async function GET(req: NextRequest) {
    try {
        const services = await getCachedServices();
        return NextResponse.json(services);
    } catch (error) {
        console.error('Failed to fetch services:', error);
        return NextResponse.json({ error: 'فشل في جلب الخدمات' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const service = await Service.create(body) as any;

        // Invalidate cache
        revalidateTag('services', 'max');

        const serviceObj = {
            ...service.toObject(),
            _id: service._id.toString(),
        };

        return NextResponse.json(serviceObj, { status: 201 });
    } catch (error) {
        console.error('Failed to create service:', error);
        return NextResponse.json({ error: 'فشل في إنشاء الخدمة' }, { status: 500 });
    }
}
