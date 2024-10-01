import { Schema, model } from "mongoose";

export interface IService {
    _id: string;
    name: string;
    description: string;
    requireAttendance: boolean;
    status: string;
    isStandard: boolean;
    serviceKey: string;
    isPopular: boolean;
    visibleTo: string;
    qualityAssuranceText: string;
    inclusionText: string;
    requirementForm: string;
    displayOrder: number;
   
    _created_at: Date;
    _updated_at: Date;
}

const serviceSchema = new Schema<IService>({
    _id: { type: String },
    name: { type: String },
    description: { type: String },
    requireAttendance: { type: Boolean },
    status: { type: String },
    isStandard: { type: Boolean },
    serviceKey: { type: String },
    isPopular: { type: Boolean },
    visibleTo: { type: String },
    qualityAssuranceText: { type: String },
    inclusionText: { type: String },
    requirementForm: { type: String },
    displayOrder: { type: Number },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: 'Service' });

export const Service = model<IService>('Service', serviceSchema);