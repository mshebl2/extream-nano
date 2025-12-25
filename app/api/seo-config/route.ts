import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SEOConfig from '@/models/SEOConfig';

export async function GET() {
    await connectDB();
    try {
        let config = await SEOConfig.findOne({ configKey: 'global' });

        if (!config) {
            config = new SEOConfig({ configKey: 'global' });
            await config.save();
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching SEO config:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await connectDB();
    try {
        const body = await req.json();
        const {
            globalAutoSEO,
            globalAutoInternalLinks,
            maxInternalLinksPerPost,
            defaultMetaKeywordsCount,
            siteName,
            siteNameAr,
            defaultOGImage,
            twitterHandle,
        } = body;

        let config = await SEOConfig.findOne({ configKey: 'global' });

        if (!config) {
            config = new SEOConfig({ configKey: 'global' });
        }

        if (globalAutoSEO !== undefined) config.globalAutoSEO = globalAutoSEO;
        if (globalAutoInternalLinks !== undefined) config.globalAutoInternalLinks = globalAutoInternalLinks;
        if (maxInternalLinksPerPost !== undefined) config.maxInternalLinksPerPost = maxInternalLinksPerPost;
        if (defaultMetaKeywordsCount !== undefined) config.defaultMetaKeywordsCount = defaultMetaKeywordsCount;
        if (siteName !== undefined) config.siteName = siteName;
        if (siteNameAr !== undefined) config.siteNameAr = siteNameAr;
        if (defaultOGImage !== undefined) config.defaultOGImage = defaultOGImage;
        if (twitterHandle !== undefined) config.twitterHandle = twitterHandle;

        config.updatedAt = new Date();
        await config.save();

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating SEO config:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
