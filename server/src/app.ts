import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS — allow the client origin with credentials (required for cookies)
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limit general auth endpoints — 20 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too Many Requests', message: 'Too many attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// Strict rate limit for OTP verification & password resets — 5 requests per 15 minutes
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too Many Requests', message: 'Too many OTP attempts. Please try again in 15 minutes.' },
});
app.use('/api/auth/verify-email', otpLimiter);
app.use('/api/auth/send-verification-otp', otpLimiter);
app.use('/api/auth/forgot-password', otpLimiter);
app.use('/api/auth/reset-password', otpLimiter);

// API Routes
app.use('/api', routes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
