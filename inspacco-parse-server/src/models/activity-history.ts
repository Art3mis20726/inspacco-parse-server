/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from "mongoose";

export interface IActivityHistory {
    _id: string;
    action: string;
    value: string;
    title?: string;
    description?: string;
    metadata?: { [key: string]: any };
    _p_createdBy: string;
    _created_at: Date;
    _updated_at: Date;
}

const activityHistorySchema = new Schema<IActivityHistory>({
    _id: { type: String },
    action: { type: String },
    value: { type: String },
    title: { type: String },
    description: { type: String },
    metadata: { type: Object },
    _p_createdBy: { type: String },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: 'ActivityHistory' });

export const ActivityHistory = model<IActivityHistory>('ActivityHistory', activityHistorySchema);