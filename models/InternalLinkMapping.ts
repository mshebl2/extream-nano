import mongoose, { Schema, Model } from "mongoose";

export interface IInternalLinkMapping {
    keyword: string;
    keywordAr?: string;
    url: string;
    priority: number;
    caseSensitive: boolean;
    maxOccurrences: number;
    isActive: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const InternalLinkMappingSchema = new Schema<IInternalLinkMapping>(
    {
        keyword: { type: String, required: true, unique: true },
        keywordAr: { type: String, default: '' }, // Arabic keyword variant
        url: { type: String, required: true },
        priority: { type: Number, default: 0 }, // Higher priority links are applied first
        caseSensitive: { type: Boolean, default: false },
        maxOccurrences: { type: Number, default: 1 }, // Max times this keyword can be linked per post
        isActive: { type: Boolean, default: true },
        description: { type: String, default: '' }, // Admin note
    },
    { timestamps: true }
);

const InternalLinkMapping: Model<IInternalLinkMapping> =
    mongoose.models.InternalLinkMapping || mongoose.model<IInternalLinkMapping>("InternalLinkMapping", InternalLinkMappingSchema);

export default InternalLinkMapping;
