export const NOTIFICATION_CONFIG = {
  SCHOLARSHIP_DEADLINE_DAYS: 30,
  APPLICATION_DEADLINE_DAYS: 30,
  STALE_APPLICATION_DAYS: 14,
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Calculates the difference in days between two dates.
 * Positive number means future, negative means past.
 */
const getDaysDiff = (targetDate, now) => {
  if (!targetDate) return null;
  const d = new Date(targetDate);
  if (isNaN(d.getTime())) return null; // Invalid date

  return (d.getTime() - now.getTime()) / MS_PER_DAY;
};

/**
 * Derives notifications based on deterministic state rules.
 * Does not mutate inputs.
 * 
 * @param {Object} params
 * @param {Object} params.profile - User profile data from useDashboardProfile
 * @param {Array} params.applications - Applications data from useDashboardApplications
 * @param {Object} params.scholarships - Scholarships data from useDashboardScholarships { items: [] }
 * @param {Date} params.now - Dependency injected current date (default new Date())
 * @returns {Array} Array of notification objects
 */
export const deriveNotifications = ({
  profile,
  applications = [],
  scholarships = { items: [] },
  now = new Date()
}) => {
  const notifications = [];

  // 1. Profile Completion Reminder
  // Trigger: Missing any of the 5 core recommendation fields
  if (profile) {
    const isProfileIncomplete =
      !profile.cgpa ||
      !profile.course ||
      !profile.degree ||
      !profile.budget ||
      !profile.countryPreference;

    if (isProfileIncomplete) {
      notifications.push({
        id: 'profile_completion_reminder',
        type: 'warning',
        icon: '⚠️',
        title: 'Profile Incomplete',
        message: 'Complete your academic profile (CGPA, Course, Degree, Budget, Country) to get better recommendations.',
      });
    }
  }

  // 2. Scholarship Deadline Alerts (Aggregate to max 1)
  if (scholarships && Array.isArray(scholarships.items)) {
    const upcomingScholarships = scholarships.items
      .map(sch => {
        const daysLeft = getDaysDiff(sch.applicationDeadline, now);
        return { ...sch, daysLeft };
      })
      .filter(sch => sch.daysLeft !== null && sch.daysLeft >= 0 && sch.daysLeft <= NOTIFICATION_CONFIG.SCHOLARSHIP_DEADLINE_DAYS)
      .sort((a, b) => a.daysLeft - b.daysLeft); // Ascending, nearest first

    if (upcomingScholarships.length > 0) {
      const nearest = upcomingScholarships[0];
      const daysStr = Math.ceil(nearest.daysLeft) === 1 ? '1 day' : `${Math.ceil(nearest.daysLeft)} days`;
      
      notifications.push({
        id: `scholarship_alert_${nearest._id || nearest.id}`,
        type: 'warning',
        icon: '🎓',
        title: 'Scholarship Deadline Approaching',
        message: `The deadline for ${nearest.name || 'a recommended scholarship'} is in ${daysStr}.`,
      });
    }
  }

  // 3. Application Reminders & Existing Phase 6 Rules
  if (Array.isArray(applications)) {
    applications.forEach(app => {
      // Phase 6 existing rules
      if (app.status === 'Accepted') {
        notifications.push({
          id: `app_accepted_${app._id || app.id}`,
          type: 'success',
          icon: '🎉',
          title: `Accepted!`,
          message: `Your application to ${app.university?.name || 'Unknown University'} has been accepted.`,
        });
        return; // Don't process stale/deadlines for accepted
      }
      if (app.status === 'Waitlisted') {
        notifications.push({
          id: `app_waitlist_${app._id || app.id}`,
          type: 'warning',
          icon: '⏳',
          title: `Waitlisted`,
          message: `Your application to ${app.university?.name || 'Unknown University'} is currently waitlisted.`,
        });
        return; // Don't process stale/deadlines for waitlisted
      }

      // New Phase 7 Application Reminders
      if (app.status === 'Planning') {
        const deadlineDays = getDaysDiff(app.university?.applicationDeadline, now);
        const hasDeadline = deadlineDays !== null;
        
        // Priority A: Upcoming deadline
        if (hasDeadline && deadlineDays >= 0 && deadlineDays <= NOTIFICATION_CONFIG.APPLICATION_DEADLINE_DAYS) {
          const daysStr = Math.ceil(deadlineDays) === 1 ? '1 day' : `${Math.ceil(deadlineDays)} days`;
          notifications.push({
            id: `app_deadline_${app._id || app.id}`,
            type: 'warning',
            icon: '⏰',
            title: 'Application Deadline Approaching',
            message: `The application deadline for ${app.university?.name || 'Unknown University'} is in ${daysStr}.`,
          });
        } 
        // Priority B: Fallback to Stale Application logic
        else {
          const staleDays = -getDaysDiff(app.updatedAt, now); // negative because updatedAt is in the past
          if (staleDays !== null && staleDays >= NOTIFICATION_CONFIG.STALE_APPLICATION_DAYS) {
            notifications.push({
              id: `app_stale_${app._id || app.id}`,
              type: 'warning', // Reuse warning UI
              icon: '📝',
              title: 'Application Needs Update',
              message: `Your application to ${app.university?.name || 'Unknown University'} has been in Planning for over ${Math.floor(staleDays)} days.`,
            });
          }
        }
      }
    });
  }

  return notifications;
};
