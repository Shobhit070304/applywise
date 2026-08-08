import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';
import { cloudinary } from '../utils/cloudinaryUpload';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(userId).select('name email isVerified role createdAt');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      // Return clean default structure if profile hasn't been saved yet
      profile = new Profile({
        userId,
        preferredRoles: [],
        preferredLocations: [],
        experienceLevel: 'Fresher',
        jobType: ['Full-time'],
        skills: [],
      });
    }

    res.status(200).json({
      user,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const { name, preferredRoles, preferredLocations, experienceLevel, jobType, skills } = req.body;

    // Update user name if provided
    if (name && name.trim()) {
      await User.findByIdAndUpdate(userId, { name: name.trim() });
    }

    const cleanArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.map((item) => String(item).trim()).filter(Boolean);
      if (typeof val === 'string') return val.split(',').map((item) => item.trim()).filter(Boolean);
      return [];
    };

    const updateData: any = {};
    if (preferredRoles !== undefined) updateData.preferredRoles = cleanArray(preferredRoles);
    if (preferredLocations !== undefined) updateData.preferredLocations = cleanArray(preferredLocations);
    if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
    if (jobType !== undefined) updateData.jobType = cleanArray(jobType);
    if (skills !== undefined) updateData.skills = cleanArray(skills);

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    const updatedUser = await User.findById(userId).select('name email isVerified role createdAt');

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

export const uploadresume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const stream = cloudinary.uploader.upload_stream({
      folder: "applywise_resumes",
      resource_type: "auto",
    }, async (error, result) => {
      if (error || !result) {
        res.status(500).json({ message: "Failed to upload resume" });
        return;
      }

      const userId = req.user?._id;
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: { resumeUrl: result.secure_url, resumePublicId: result.public_id, resumeOriginalName: req.file?.originalname } },
        { new: true, upsert: true }
      );

      res.status(200).json({
        message: "Resume uploaded successfully",
        profile,
      });
    });

    stream.end(req.file.buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
}
