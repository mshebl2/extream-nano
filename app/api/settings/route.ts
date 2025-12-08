import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const settings = await Setting.find().lean();

        const settingsMap: Record<string, any> = {};
        settings.forEach((setting: any) => {
            settingsMap[setting.key] = {
                ...setting,
                _id: setting._id.toString(),
            };
        });

        return NextResponse.json(settingsMap);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return NextResponse.json({ error: 'فشل في جلب الإعدادات' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const updates = Object.entries(body).map(async ([key, data]: [string, any]) => {
            return Setting.findOneAndUpdate(
                { key },
                { ...data, key, updatedAt: new Date() },
                { upsert: true, new: true }
            );
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to update settings:', error);
        return NextResponse.json({ error: 'فشل في تحديث الإعدادات' }, { status: 500 });
    }
}
