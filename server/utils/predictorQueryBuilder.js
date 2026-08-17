/**
 * Admission Predictor Query Builder Utility
 * Constructs a deterministic MongoDB aggregation pipeline.
 * BANNED: Probability percentages or LLM AI logic.
 */

import { buildFilter } from './universityQueryBuilder.js';

export const ADMISSION_SAFE_THRESHOLD = 75;
export const ADMISSION_TARGET_THRESHOLD = 50;

export const buildPredictorPipeline = (user, queryFilters = {}) => {
  const pipeline = [];

  // 1. Initial Filtering (Mandatory Data + User Search Filters)
  const baseFilters = buildFilter(queryFilters);
  const initialFilter = {
    ...baseFilters,
    // STRICT REJECTION: Exclude if critical data is missing
    cgpaRequirement: { $ne: null, $exists: true },
    acceptanceRate: { $ne: null, $exists: true }
  };

  pipeline.push({ $match: initialFilter });

  // 2. Base Dimensions Setup
  let maxPossibleScore = 80; // CGPA (50) + Acceptance Rate (30)

  const scoreAdditions = [];

  // --- CGPA SCORE (Max 50) ---
  // If user CGPA is lower than requirement: 0
  // If user CGPA == requirement: 30
  // If user CGPA strongly exceeds (+0.3 or more): 50
  // Scales linearly between 0 and 0.3
  scoreAdditions.push({
    $cond: [
      { $lt: [user.cgpa, '$cgpaRequirement'] },
      0, // Below requirement
      {
        $cond: [
          { $gte: [{ $subtract: [user.cgpa, '$cgpaRequirement'] }, 0.3] },
          50, // Strongly exceeds
          {
            // Between exact match (30) and strong exceed (50)
            // 30 + ((diff / 0.3) * 20)
            $add: [
              30,
              {
                $multiply: [
                  { $divide: [{ $subtract: [user.cgpa, '$cgpaRequirement'] }, 0.3] },
                  20
                ]
              }
            ]
          }
        ]
      }
    ]
  });

  // --- ACCEPTANCE RATE SCORE (Max 30) ---
  // Points = min(acceptanceRate * 0.5, 30)
  scoreAdditions.push({
    $min: [
      { $multiply: ['$acceptanceRate', 0.5] },
      30
    ]
  });

  // --- COURSE MATCH (Max 20) ---
  // Optional dynamic denominator addition
  if (user.course && user.course.trim() !== '') {
    maxPossibleScore += 20;
    const escapedCourse = user.course.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    scoreAdditions.push({
      $cond: [
        {
          $gt: [
            {
              $size: {
                $filter: {
                  input: { $ifNull: ['$courses', []] },
                  as: 'courseName',
                  cond: {
                    $regexMatch: {
                      input: '$$courseName',
                      regex: `^${escapedCourse}$`,
                      options: 'i',
                    },
                  },
                },
              },
            },
            0,
          ],
        },
        20,
        0,
      ]
    });
  }

  // 3. Score Calculation Pipeline Stage
  pipeline.push({
    $addFields: {
      rawAdmissionScore: { $add: scoreAdditions },
      maxDenominator: maxPossibleScore
    }
  });

  // 4. Normalize to 100-point heuristic score
  pipeline.push({
    $addFields: {
      normalizedPredictorScore: {
        $round: [
          { $multiply: [{ $divide: ['$rawAdmissionScore', '$maxDenominator'] }, 100] },
          0
        ]
      }
    }
  });

  // 5. Categorization Switch
  pipeline.push({
    $addFields: {
      matchStatus: {
        $switch: {
          branches: [
            { case: { $gte: ['$normalizedPredictorScore', ADMISSION_SAFE_THRESHOLD] }, then: 'Safe' },
            { case: { $gte: ['$normalizedPredictorScore', ADMISSION_TARGET_THRESHOLD] }, then: 'Target' }
          ],
          default: 'Dream'
        }
      }
    }
  });

  // 6. Sort by Predictor Score descending
  pipeline.push({
    $sort: { normalizedPredictorScore: -1, name: 1 }
  });

  return pipeline;
};
