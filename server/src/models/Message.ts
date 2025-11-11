import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  propertyId?: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
