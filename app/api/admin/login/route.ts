import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

        if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
            return NextResponse.json({ error: 'خطأ في إعدادات الخادم' }, { status: 500 });
        }

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = await signToken({ username });

            const response = NextResponse.json({ success: true });
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'خطأ في الخادم' }, { status: 500 });
    }
}
