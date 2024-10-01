import { Schema, model } from "mongoose";

export interface IUser {
    _id: string;
    username: string;
    password: string;
    email: string;
    emailVerified: boolean;
    authData: { [key: string]: any };
    firstName: string;
    lastName: string;
    gender: string;
    dob: Date;
    profilePicture: string;
    mobileNumber: string;
    createdBy: string;
    totalRewardPoints: number;
    personFaceId: string;
    _created_at: Date;
    _updated_at: Date;
}

const userSchema = new Schema<IUser>({
    _id: { type: String },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    emailVerified: { type: Boolean },
    authData: { type: Object },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    dob: { type: Date },
    profilePicture: { type: String },
    mobileNumber: { type: String },
    createdBy: { type: String },
    totalRewardPoints: { type: Number },
    personFaceId: { type: String },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: '_User' });

export const User = model<IUser>('_User', userSchema);