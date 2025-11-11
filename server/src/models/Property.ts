import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  landlordId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  propertyType: 'apartment' | 'house' | 'condo' | 'townhouse' | 'studio';
  amenities: string[];
  images: string[];
  available: boolean;
  availableFrom?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>({
  landlordId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  squareFeet: { type: Number },
  propertyType: { 
    type: String, 
    enum: ['apartment', 'house', 'condo', 'townhouse', 'studio'],
    required: true 
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  available: { type: Boolean, default: true },
  availableFrom: { type: Date }
}, {
  timestamps: true
});

export const Property = mongoose.model<IProperty>('Property', propertySchema);
