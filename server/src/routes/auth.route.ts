import { Router } from 'express';
import {
  register,
  login,
  getMe,
  refresh,
  logout,
  sendVerificationOtp,
  verifyEmail,
  sendResetOtp,
  resetPassword,
  googleLogin,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/refresh', refresh);
router.post('/logout', authenticate, logout);

// OTP Email Verification
router.post('/send-verification-otp', sendVerificationOtp);
router.post('/verify-email', verifyEmail);

// OTP Password Reset
router.post('/forgot-password', sendResetOtp);
router.post('/reset-password', resetPassword);

router.post('/google', googleLogin);

export default router;
