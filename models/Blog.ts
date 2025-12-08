import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    titleAr: string;
    slug: string;
    description: string;
    descriptionAr: string;
    content: string;
    contentAr: string;
    image: string;
    imageFileId?: string;
    featured?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema: Schema = new Schema({
    title: { type: String, required: true },
    titleAr: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    descriptionAr: { type: String, required: true },
    content: { type: String, required: false },
    contentAr: { type: String, required: false },
    image: { type: String, required: false },
    imageFileId: { type: String, required: false },
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
