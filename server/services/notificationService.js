import cron from 'node-cron';
import User from '../models/User.js';
import Application from '../models/Application.js';
import Scholarship from '../models/Scholarship.js';
import { deriveNotifications } from '../utils/notificationDeriver.js';
import { sendEmail } from './emailService.js';

const SCHOLARSHIP_DIGEST_INTERVAL_DAYS = 14;

/**
 * Evaluates notifications for a single user and sends emails if appropriate.
 * Checks and updates the idempotency flags on User and Application schemas.
 */
const processUserNotifications = async (user) => {
  try {
    const applications = await Application.find({ user: user._id }).populate('university', 'name applicationDeadline');

    let scholarshipQuery = {};
    if (user.countryPreference) {
      scholarshipQuery.country = user.countryPreference;
    }
    if (user.cgpa) {
      scholarshipQuery.minimumCgpa = { $lte: user.cgpa };
    }
    
    const recommendedScholarships = await Scholarship.find(scholarshipQuery).limit(20);

    const now = new Date();
    const notifications = deriveNotifications({
      profile: user,
      applications,
      scholarships: recommendedScholarships,
      now
    });

    for (const notification of notifications) {
      // 1. Profile Completion
      if (notification.id === 'profile_completion_reminder' && !user.profileReminderSent) {
        const success = await sendEmail(
          user.email,
          'Complete your UniCoFinder Profile',
          `<p>Hi ${user.name},</p><p>${notification.message}</p><p>Log in to update your profile.</p>`
        );
        if (success.success) {
          user.profileReminderSent = true;
          await user.save();
        }
      }

      // 2. Scholarship Digest
      if (notification.id.startsWith('scholarship_alert_')) {
        const lastSent = user.lastScholarshipDigestSentAt;
        const daysSinceLastSent = lastSent ? (now.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

        if (daysSinceLastSent >= SCHOLARSHIP_DIGEST_INTERVAL_DAYS) {
          const success = await sendEmail(
            user.email,
            'Upcoming Scholarship Deadlines',
            `<p>Hi ${user.name},</p><p>${notification.message}</p><p>Check your dashboard for details.</p>`
          );
          if (success.success) {
            user.lastScholarshipDigestSentAt = now;
            await user.save();
          }
        }
      }

      // 3. Application Deadline / Stale
      if (notification.id.startsWith('app_deadline_') || notification.id.startsWith('app_stale_')) {
        // Extract app ID from string like 'app_deadline_12345'
        const parts = notification.id.split('_');
        const appId = parts[parts.length - 1];
        const isDeadline = notification.id.startsWith('app_deadline_');

        const app = applications.find(a => a._id.toString() === appId);
        if (app) {
          let shouldSend = false;
          if (isDeadline && !app.deadlineReminderSent) {
            shouldSend = true;
          } else if (!isDeadline && !app.staleReminderSent) {
            shouldSend = true;
          }

          if (shouldSend) {
            const success = await sendEmail(
              user.email,
              isDeadline ? 'Application Deadline Approaching' : 'Application Needs Update',
              `<p>Hi ${user.name},</p><p>${notification.message}</p><p>Please update your application status on UniCoFinder.</p>`
            );
            
            if (success.success) {
              if (isDeadline) app.deadlineReminderSent = true;
              else app.staleReminderSent = true;
              await app.save();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error processing notifications for user ${user._id}:`, error);
  }
};

/**
 * Main cron job runner. Iterates through users sequentially.
 */
export const runNotificationJob = async () => {
  console.log('Starting daily notification job...');
  try {
    // Process in batches or sequentially to avoid overwhelming the event loop/memory
    const users = await User.find({});
    for (const user of users) {
      await processUserNotifications(user);
    }
    console.log('Daily notification job completed.');
  } catch (error) {
    console.error('Failed to run daily notification job:', error);
  }
};

/**
 * Initializes the node-cron scheduler.
 * Runs daily at midnight UTC.
 */
export const initNotificationCron = () => {
  // Run every day at 00:00
  cron.schedule('0 0 * * *', () => {
    runNotificationJob();
  });
  console.log('Notification cron job scheduled.');
};
