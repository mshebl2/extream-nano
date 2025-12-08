import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteImage extends Document {
    key: string;
    url: string;
    section: string;
    label: string;
    description?: string;
    updatedAt: Date;
}

const SiteImageSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    section: { type: String, required: true },
    label: { type: String, required: true },
    description: { type: String },
    updatedAt: { type: Date, default: Date.now },
});

const SiteImage: Model<ISiteImage> = mongoose.models.SiteImage || mongoose.model<ISiteImage>('SiteImage', SiteImageSchema);

export default SiteImage;
