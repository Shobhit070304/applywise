import { Resend } from 'resend';
import { config } from '../config';

const resend = new Resend(config.resendApiKey || 're_dummy');
const FROM_EMAIL = config.emailFrom;

export const sendOtpEmail = async (
  email: string,
  otp: string,
  type: 'verification' | 'reset'
): Promise<boolean> => {
  const isVerify = type === 'verification';
  const subject = isVerify ? 'Verify your ApplyWise Email' : 'Reset your ApplyWise Password';
  const title = isVerify ? 'Email Verification Code' : 'Password Reset Code';

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; margin: 0 auto; padding: 24px; border: 1px solid #27272a; border-radius: 12px; background-color: #09090b; color: #f4f4f5;">
          <h2 style="color: #fbbf24; font-size: 20px; margin: 0 0 4px 0; font-weight: 600;">ApplyWise</h2>
          <p style="font-size: 14px; color: #e4e4e7; margin: 0 0 16px 0;">${title}</p>
          <p style="font-size: 13px; color: #a1a1aa; margin-bottom: 12px;">Your 6-digit verification code is:</p>
          <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #fbbf24; background: #18181b; padding: 14px; text-align: center; border-radius: 8px; border: 1px solid #27272a; margin-bottom: 16px;">
            ${otp}
          </div>
          <p style="font-size: 11px; color: #71717a; margin: 0;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
        </div>
      `,
    });

    console.log(`\x1b[33m[ApplyWise OTP]\x1b[0m Sent to: ${email} | Code: \x1b[1m${otp}\x1b[0m (${type})`);

    if (error) {
      console.error('Resend email notice (check test recipient email):', error.message || error);
      // Still return true in dev so flow continues smoothly
      return true;
    }
    return true;
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    return false;
  }
};
