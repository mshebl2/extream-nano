import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISetting extends Document {
    key: string;
    value: any;
    type: 'string' | 'number' | 'boolean' | 'json';
    label: string;
    labelAr: string;
    group: string;
    updatedAt: Date;
}

const SettingSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
    label: { type: String, required: true },
    labelAr: { type: String, required: true },
    group: { type: String, default: 'general' },
    updatedAt: { type: Date, default: Date.now },
});

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);

export default Setting;
