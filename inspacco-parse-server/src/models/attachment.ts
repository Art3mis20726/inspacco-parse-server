import { Schema, model } from "mongoose";

export interface IAttachment {
    _id: string;
    name: string;
    fileName: string;
    url: string;
    parentId: string;
    module: string;
    status: string;
    permissionGroupId: string;
    _p_createdBy: string;
    _created_at: Date;
    _updated_at: Date;
}

const attachmentSchema = new Schema<IAttachment>({
    _id: { type: String },
    name: { type: String },
    fileName: { type: String },
    url: { type: String },
    parentId: { type: String },
    module: { type: String },
    status: { type: String },
    permissionGroupId: { type: String },
    _p_createdBy: { type: String },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: 'Attachment' });

export const Attachment = model<IAttachment>('Attachment', attachmentSchema);