import crypto from 'crypto';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Generate 6-digit OTP
export function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Hash OTP for secure storage
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

// Send OTP via email using Resend
export async function sendOTP(email: string, otp: string, name?: string) {
  // Check if Resend is configured
  if (!resend) {
    throw new Error('Email service not configured. Please set RESEND_API_KEY environment variable.');
  }

  try {
    await resend.emails.send({
      from: 'SDEVX Technology <onboarding@resend.dev>', // Change this to your verified domain
      to: email,
      subject: 'Your SDEVX Login OTP',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">SDEVX Technology</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1a1a1a; margin-top: 0;">Your Login Code</h2>
              
              ${name ? `<p style="font-size: 16px; color: #64748b;">Hi ${name},</p>` : ''}
              
              <p style="font-size: 16px; color: #64748b;">
                Use the following One-Time Password (OTP) to complete your login:
              </p>
              
              <div style="background: #f8fafc; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                <strong>This OTP will expire in 10 minutes.</strong>
              </p>
              
              <p style="font-size: 14px; color: #64748b;">
                If you didn't request this code, please ignore this email or contact support if you have concerns.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                © ${new Date().getFullYear()} SDEVX Technology. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    return true;
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    const errorMessage = error?.message || error?.response?.message || 'Unknown error';
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

// Verify OTP
export function verifyOTP(inputOTP: string, storedHashedOTP: string): boolean {
  const hashedInput = hashOTP(inputOTP);
  return hashedInput === storedHashedOTP;
}

// Check if OTP is expired
export function isOTPExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}
