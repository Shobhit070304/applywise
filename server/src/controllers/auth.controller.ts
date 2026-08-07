import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { Otp } from '../models/otp.model';
import { generateRefreshToken, generateToken, verifyRefreshToken } from '../utils/jwt';
import { sendOtpEmail } from '../utils/email';
import { AuthRequest } from '../middleware/auth.middleware';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const googleClient = new OAuth2Client(config.googleClientId);

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: (config.isProduction ? 'none' : 'lax') as 'none' | 'lax',
};

function setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearTokenCookies(res: Response) {
  res.clearCookie('access_token', cookieOptions);
  res.clearCookie('refresh_token', cookieOptions);
}

const generate6DigitOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Validation Error', message: 'Name, email, and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({ error: 'Validation Error', message: 'Please provide a valid email address' });
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      res.status(409).json({ error: 'Conflict', message: 'User with this email already exists' });
      return;
    }

    const user = await User.create({ name: name.trim(), email: cleanEmail, password });
    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    setTokenCookies(res, accessToken, refreshToken);

    // Generate & send initial verification OTP automatically
    const otp = generate6DigitOtp();
    await Otp.deleteMany({ email: cleanEmail, type: 'verification' });
    await Otp.create({ email: cleanEmail, otp, type: 'verification' });
    sendOtpEmail(cleanEmail, otp, 'verification');

    res.status(201).json({ message: 'User registered successfully. Verification OTP sent to email.', user });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      res.status(400).json({ error: 'Validation Error', message: 'Please provide a valid email address' });
      return;
    }

    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
      return;
    }

    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({ user: (req as AuthRequest).user });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ error: 'Unauthorized', message: 'No refresh token provided' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      clearTokenCookies(res);
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired refresh token' });
      return;
    }

    const newAccessToken = generateToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({ message: 'Token refreshed successfully' });
  } catch (error) {
    clearTokenCookies(res);
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    clearTokenCookies(res);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Send / Resend Email Verification OTP
export const sendVerificationOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const email = authReq.user?.email || req.body.email;

    if (!email) {
      res.status(400).json({ error: 'Validation Error', message: 'Email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = generate6DigitOtp();

    await Otp.deleteMany({ email: cleanEmail, type: 'verification' });
    await Otp.create({ email: cleanEmail, otp, type: 'verification' });
    await sendOtpEmail(cleanEmail, otp, 'verification');

    res.status(200).json({ message: 'Verification OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// Verify Email with OTP
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const email = authReq.user?.email || req.body.email;
    const { otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Validation Error', message: 'Email and OTP are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpRecord = await Otp.findOne({ email: cleanEmail, otp, type: 'verification' });

    if (!otpRecord) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid or expired OTP code' });
      return;
    }

    await User.updateOne({ email: cleanEmail }, { isVerified: true });
    await Otp.deleteMany({ email: cleanEmail, type: 'verification' });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

// Request Password Reset OTP
export const sendResetOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Validation Error', message: 'Email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      res.status(404).json({ error: 'Not Found', message: 'No account found with this email' });
      return;
    }

    const otp = generate6DigitOtp();
    await Otp.deleteMany({ email: cleanEmail, type: 'reset' });
    await Otp.create({ email: cleanEmail, otp, type: 'reset' });
    await sendOtpEmail(cleanEmail, otp, 'reset');

    res.status(200).json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// Reset Password with OTP
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ error: 'Validation Error', message: 'Email, OTP, and new password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!PASSWORD_REGEX.test(newPassword)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
      return;
    }

    const otpRecord = await Otp.findOne({ email: cleanEmail, otp, type: 'reset' });

    if (!otpRecord) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid or expired OTP code' });
      return;
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      res.status(404).json({ error: 'Not Found', message: 'User account not found' });
      return;
    }

    user.password = newPassword;
    await user.save(); // pre-save hook automatically hashes password

    await Otp.deleteMany({ email: cleanEmail, type: 'reset' });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { credential } = req.body; // ID Token from frontend

    if (!credential) {
      res.status(400).json({ error: 'Validation Error', message: 'Google credential token is required' });
      return;
    }

    // 1. Verify Google ID Token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Validation Error', message: 'Invalid Google token' });
      return;
    }

    const { email, name, sub: googleId } = payload;
    const cleanEmail = email.toLowerCase();

    // 2. Account Linking / Upsert User
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // Link Google ID if user registered via email earlier
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.isVerified = true; // Google emails are pre-verified by Google
      await user.save();
    } else {
      // Create new user for first-time Google login
      user = await User.create({
        name: name || 'Google User',
        email: cleanEmail,
        googleId,
        isVerified: true,
      });
    }

    // 3. Issue your standard HttpOnly Cookies (Reuse your existing helper!)
    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: 'Google login successful', user });
  } catch (error) {
    next(error);
  }
};
