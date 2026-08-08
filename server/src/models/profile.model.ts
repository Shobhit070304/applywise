import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  preferredRoles: string[];
  preferredLocations: string[];
  experienceLevel: 'Fresher' | '0-2 yrs' | '2-5 yrs' | '5+ yrs';
  jobType: string[];
  skills: string[];
  resumeUrl: string;
  resumePublicId: string;
  resumeOriginalName: string;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    preferredRoles: {
      type: [String],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', '0-2 yrs', '2-5 yrs', '5+ yrs'],
      default: 'Fresher',
    },
    jobType: {
      type: [String],
      default: ['Full-time'],
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: { type: String, default: '' },
    resumePublicId: { type: String, default: '' },
    resumeOriginalName: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
