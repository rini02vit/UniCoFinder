import { STATUS_CONFIG, STATUS_BADGE_MAP } from '../constants/trackerConfig';

/**
 * Normalizes raw API application data and attaches derived metadata
 * needed for the Tracker UI.
 */
export const normalizeApplicationData = (rawApps) => {
  if (!Array.isArray(rawApps)) return [];

  return rawApps.map(app => {
    // API provides 'Pending', 'Accepted', 'Rejected'
    // We map it to our timeline index
    const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG['Pending'];
    
    // Explicitly derive normalized fields
    const currentStage = statusConfig.index;
    const completedStages = currentStage;
    
    return {
      id: app._id,
      universityName: app.universityId?.name || 'Unknown University',
      status: app.status || 'Pending',
      updatedAt: app.updatedAt,
      // Derived UI-ready properties
      currentStage: currentStage,
      completedStages: completedStages,
      statusVariant: STATUS_BADGE_MAP[app.status] || 'default',
      isTerminalStatus: app.status === 'Accepted' || app.status === 'Rejected'
    };
  });
};
