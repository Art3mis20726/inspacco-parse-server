import { Schema, model } from "mongoose";

interface IServiceRequest {
    _id: string;
    _p_requester: string;
    _p_society: string;

    _p_service: string;

    status: string;
    displayId: number;
    priority: string;
    subService: string;
   
    _created_at: Date;
    _updated_at: Date;
}

const serviceRequestSchema = new Schema<IServiceRequest>({
    _id: { type: String },
    _p_requester: { type: String },
    _p_society: { type: String },
    _p_service: { type: String },
    status: { type: String },
    displayId: { type: Number },
    priority: { type: String },
    subService: { type: String },
    _created_at: { type: Date },
    _updated_at: { type: Date },
}, { collection: 'ServiceRequest' });

export const ServiceRequest = model<IServiceRequest>('ServiceRequest', serviceRequestSchema);