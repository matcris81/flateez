import mongoose, { Schema, Document } from 'mongoose';

export type UserType = 'landlord' | 'renter';

export interface IRenterProfile {
  yearsOfExperience?: number;
  previousAddresses?: string[];
  employmentStatus?: string;
  monthlyIncome?: number;
  hasPets?: boolean;
  petDetails?: string;
  smoker?: boolean;
  references?: Array<{
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  }>;
  feedbackCount?: number;
  rating?: number;
}

export interface IUser extends Document {
  email: string;
  password: string;
  userType: UserType;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  renterProfile?: IRenterProfile;
  savedProperties?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['landlord', 'renter'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String },
  bio: { type: String },
  verified: { type: Boolean, default: false },
  savedProperties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  renterProfile: {
    yearsOfExperience: { type: Number },
    previousAddresses: [{ type: String }],
    employmentStatus: { type: String },
    monthlyIncome: { type: Number },
    hasPets: { type: Boolean },
    petDetails: { type: String },
    smoker: { type: Boolean },
    references: [{
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
      email: { type: String }
    }],
    feedbackCount: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5 }
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);
