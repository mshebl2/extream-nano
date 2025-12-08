import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import connectDB from '@/lib/db';
import Service from '@/models/Service';

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const service = await Service.findById(id).lean();

        if (!service) {
            return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
        }

        return NextResponse.json({
            ...service,
            _id: (service as any)._id.toString(),
        });
    } catch (error) {
        console.error('Failed to fetch service:', error);
        return NextResponse.json({ error: 'فشل في جلب الخدمة' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const service = await Service.findByIdAndUpdate(id, body, { new: true }).lean();

        if (!service) {
            return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
        }

        // Invalidate cache
        revalidateTag('services', 'max');

        return NextResponse.json({
            ...service,
            _id: (service as any)._id.toString(),
        });
    } catch (error) {
        console.error('Failed to update service:', error);
        return NextResponse.json({ error: 'فشل في تحديث الخدمة' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json({ error: 'الخدمة غير موجودة' }, { status: 404 });
        }

        // Invalidate cache
        revalidateTag('services', 'max');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to delete service:', error);
        return NextResponse.json({ error: 'فشل في حذف الخدمة' }, { status: 500 });
    }
}
