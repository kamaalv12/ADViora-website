import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IServiceEnquiry extends Document {
  userId: mongoose.Types.ObjectId;
  interest: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceEnquirySchema: Schema<IServiceEnquiry> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    interest: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== 'production',
  }
);

// Indexes for query performance
// userId already indexed in schema

const ServiceEnquiry: Model<IServiceEnquiry> =
  mongoose.models.ServiceEnquiry || mongoose.model<IServiceEnquiry>('ServiceEnquiry', ServiceEnquirySchema, 'service_enquiries');

export default ServiceEnquiry;
