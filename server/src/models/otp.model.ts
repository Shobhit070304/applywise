import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  type: 'verification' | 'reset';
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['verification', 'reset'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Automatically deletes OTP from MongoDB after 10 minutes
  },
});

export const Otp = model<IOtp>('Otp', otpSchema);
