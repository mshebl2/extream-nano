import mongoose, { Schema, Model } from "mongoose";

export interface ISEOConfig {
    configKey: string;
    globalAutoSEO: boolean;
    globalAutoInternalLinks: boolean;
    maxInternalLinksPerPost: number;
    defaultMetaKeywordsCount: number;
    siteName: string;
    siteNameAr: string;
    defaultOGImage: string;
    twitterHandle: string;
    updatedAt: Date;
}

const SEOConfigSchema = new Schema<ISEOConfig>(
    {
        configKey: { type: String, required: true, unique: true, default: 'global' },
        // Global automation flags
        globalAutoSEO: { type: Boolean, default: true },
        globalAutoInternalLinks: { type: Boolean, default: true },
        // Default settings
        maxInternalLinksPerPost: { type: Number, default: 5 },
        defaultMetaKeywordsCount: { type: Number, default: 10 },
        // Site-wide SEO defaults
        siteName: { type: String, default: 'XTREME NANO' },
        siteNameAr: { type: String, default: 'اكستريم نانو' },
        defaultOGImage: { type: String, default: '' },
        twitterHandle: { type: String, default: '@xtremenano_sa' },
    },
    { timestamps: true }
);

const SEOConfig: Model<ISEOConfig> =
    mongoose.models.SEOConfig || mongoose.model<ISEOConfig>("SEOConfig", SEOConfigSchema);

export default SEOConfig;
