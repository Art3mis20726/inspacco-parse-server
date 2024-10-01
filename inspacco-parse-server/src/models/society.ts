import { Schema, model } from "mongoose";

export interface ISociety {
    _id: string;
    name: string;
    addressLine1: string;
    addressLine2: string;
    area: string;
    city: string;
    pincode: number;
    state: string;
    email: string;
    status: string;
    amenities: string[];
    displayId: number;
    societyLat: string;
    societyLong: string;
    location: [number, number];
    logo: string;
    description: string;

    _created_at: Date;
    _updated_at: Date;
}

const societySchema = new Schema<ISociety>({
    _id: { type: String },
    name: { type: String },
    addressLine1: { type: String },
    addressLine2: { type: String },
    area: { type: String },
    city: { type: String },
    pincode: { type: Number },
    state: { type: String },
    email: { type: String },
    status: { type: String },
    amenities: { type: [String] },
    displayId: { type: Number },
    societyLat: { type: String },
    societyLong: { type: String },
    location: { type: [Number] },
    logo: { type: String },
    description: { type: String },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: 'Society' });

export const Society = model<ISociety>('Society', societySchema);