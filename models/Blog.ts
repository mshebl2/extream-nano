import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    titleAr: string;
    slug: string;
    descriptionAr: string;
    content: string;
    contentAr: string;
    image: string;
    imageFileId?: string;
    featured?: boolean;
    // SEO Fields
    autoSEO: boolean;
    autoInternalLinks: boolean;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    processedContent?: string; // Content with internal links applied
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    descriptionAr: { type: String, required: true },
    content: { type: String, required: false },
    contentAr: { type: String, required: false },
    image: { type: String, required: false },
    imageFileId: { type: String, required: false },
    featured: { type: Boolean, default: false },
    // SEO Fields
    autoSEO: { type: Boolean, default: true },
    autoInternalLinks: { type: Boolean, default: true },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    metaKeywords: { type: [String], default: [] },
    processedContent: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Force recompilation if model exists with different schema
if (mongoose.models.Blog) {
    const existingSchema = (mongoose.models.Blog as any).schema;
    // Check if schema has changed (old schema had title/description, new doesn't)
    if (existingSchema?.paths?.title || existingSchema?.paths?.description) {
        delete mongoose.models.Blog;
        const mongooseAny = mongoose as any;
        if (mongooseAny.modelSchemas && mongooseAny.modelSchemas.Blog) {
            delete mongooseAny.modelSchemas.Blog;
        }
    }
}

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
