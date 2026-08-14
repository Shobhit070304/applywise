import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid' | 'Internship';
  experienceLevel: 'Fresher' | '0-2 yrs' | '2-5 yrs' | '5+ yrs';
  salary: {
    min?: number;
    max?: number;
    currency: string;
    isDisclosed: boolean;
  };
  description: string;
  skills: string[];
  sourceUrl?: string;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'Internship'],
      default: 'Full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', '0-2 yrs', '2-5 yrs', '5+ yrs'],
      default: 'Fresher',
    },

    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      isDisclosed: { type: Boolean, default: true },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    skills: {
      type: [String],
      default: [],
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ title: 1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
