import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Configure Nodemailer transport.
 * Uses Ethereal for development testing if SMTP is not fully configured.
 */
let transporter;

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    // Production / Configured SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback: Ethereal Email for Development
    console.log('No SMTP credentials found in .env, falling back to Ethereal test account.');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
};

// Initialize the transporter immediately
createTransporter().catch(console.error);

/**
 * Send an email notification.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - Email body in HTML format
 */
export const sendEmail = async (to, subject, htmlContent) => {
  if (!transporter) {
    await createTransporter();
  }

  try {
    const info = await transporter.sendMail({
      from: `"UniCoFinder Notifications" <${process.env.SMTP_USER || 'no-reply@unicofinder.com'}>`,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Notification email sent to ${to} [MessageId: ${info.messageId}]`);
    
    // Log Ethereal URL if using the dev fallback
    if (info.messageId && !process.env.SMTP_HOST) {
      console.log('Preview Email URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
