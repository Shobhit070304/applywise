import { Router } from 'express';
import { getProfile, updateProfile, uploadresume } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadResumeMiddleware } from '../utils/cloudinaryUpload';

const router = Router();

// Protect all profile endpoints
router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/upload-resume', uploadResumeMiddleware.single('resume'), uploadresume);

export default router;
