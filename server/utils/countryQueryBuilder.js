/**
 * Country Query Builder Utility
 * Constructs MongoDB aggregation pipeline for Country Recommendations
 */

export const buildCountryRecommendationPipeline = (user) => {
  const pipeline = [];

  const RECOMMENDATION_WEIGHTS = {
    affordability: 30,
    jobOpportunitiesWorkPermit: 10,
    jobOpportunitiesPostStudy: 10,
    scholarships: 20,
    visaFriendliness: 15,
    safetyIndex: 15,
  };

  pipeline.push({
    $lookup: {
      from: 'scholarships',
      localField: 'name',
      foreignField: 'country',
      as: 'scholarshipsData',
    },
  });

  pipeline.push({
    $addFields: {
      scholarshipCount: { $size: '$scholarshipsData' },
    },
  });
  
  pipeline.push({
    $project: {
      scholarshipsData: 0,
    },
  });

  const scoreBreakdown = {};
  const totalApplicableWeightExprs = [];
  const evaluatedCategoriesCountExprs = [];

  // --- Category 1: Affordability ---
  if (user && user.budget && user.budget > 0) {
    const totalCostExpr = { $add: [{ $ifNull: ['$averageTuitionFee', 0] }, { $ifNull: ['$averageLivingCost', 0] }] };
    const hasAffordabilityData = { $gt: [totalCostExpr, 0] };
    
    scoreBreakdown.affordability = {
      $cond: [
        hasAffordabilityData,
        {
          $cond: [
            { $lte: [totalCostExpr, user.budget] },
            {
              $max: [
                0,
                {
                  $multiply: [
                    RECOMMENDATION_WEIGHTS.affordability,
                    { $subtract: [1, { $divide: [totalCostExpr, user.budget] }] }
                  ]
                }
              ]
            },
            0
          ]
        },
        0
      ]
    };
    
    totalApplicableWeightExprs.push({ $cond: [hasAffordabilityData, RECOMMENDATION_WEIGHTS.affordability, 0] });
    evaluatedCategoriesCountExprs.push({ $cond: [hasAffordabilityData, 1, 0] });
  }

  // --- Category 2: Job Opportunities ---
  const hasJobData = {
    $or: [
      { $ne: [{ $type: '$workPermit' }, 'missing'] },
      { $ne: [{ $type: '$postStudyWorkVisa' }, 'missing'] }
    ]
  };

  scoreBreakdown.jobOpportunities = {
    $cond: [
      hasJobData,
      {
        $add: [
          { $cond: [{ $eq: ['$workPermit', true] }, RECOMMENDATION_WEIGHTS.jobOpportunitiesWorkPermit, 0] },
          { $cond: [{ $eq: ['$postStudyWorkVisa', true] }, RECOMMENDATION_WEIGHTS.jobOpportunitiesPostStudy, 0] }
        ]
      },
      0
    ]
  };

  totalApplicableWeightExprs.push({ 
    $cond: [
      hasJobData, 
      RECOMMENDATION_WEIGHTS.jobOpportunitiesWorkPermit + RECOMMENDATION_WEIGHTS.jobOpportunitiesPostStudy, 
      0
    ] 
  });
  evaluatedCategoriesCountExprs.push({ $cond: [hasJobData, 1, 0] });

  // --- Category 3: Scholarships ---
  scoreBreakdown.scholarships = {
    $switch: {
      branches: [
        { case: { $gte: ['$scholarshipCount', 15] }, then: 20 },
        { case: { $gte: ['$scholarshipCount', 5] }, then: 10 },
        { case: { $gte: ['$scholarshipCount', 1] }, then: 5 },
      ],
      default: 0
    }
  };

  totalApplicableWeightExprs.push(RECOMMENDATION_WEIGHTS.scholarships);
  evaluatedCategoriesCountExprs.push(1);

  // --- Category 4: Visa Friendliness ---
  const hasVisaData = { $ne: [{ $type: '$visaFriendlinessScore' }, 'missing'] };
  
  scoreBreakdown.visaFriendliness = {
    $cond: [
      hasVisaData,
      { $multiply: [{ $divide: ['$visaFriendlinessScore', 10] }, RECOMMENDATION_WEIGHTS.visaFriendliness] },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasVisaData, RECOMMENDATION_WEIGHTS.visaFriendliness, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [hasVisaData, 1, 0] });

  // --- Category 5: Safety Index ---
  const hasSafetyData = { $ne: [{ $type: '$safetyIndex' }, 'missing'] };

  scoreBreakdown.safetyIndex = {
    $cond: [
      hasSafetyData,
      { $multiply: [{ $divide: ['$safetyIndex', 100] }, RECOMMENDATION_WEIGHTS.safetyIndex] },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasSafetyData, RECOMMENDATION_WEIGHTS.safetyIndex, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [hasSafetyData, 1, 0] });

  // Add the collected expressions as a single stage
  pipeline.push({
    $addFields: {
      scoreBreakdown: scoreBreakdown,
      // If array is empty (impossible here since 4 are unconditional, but for safety), fallback to 0
      totalApplicableWeightDoc: { $add: totalApplicableWeightExprs.length > 0 ? totalApplicableWeightExprs : [0] },
      evaluatedCategoriesCount: { $add: evaluatedCategoriesCountExprs.length > 0 ? evaluatedCategoriesCountExprs : [0] }
    }
  });

  // Minimum data quality rule (at least 3 evaluated categories)
  pipeline.push({
    $match: {
      evaluatedCategoriesCount: { $gte: 3 }
    }
  });

  // Calculate Match Percentage
  pipeline.push({
    $addFields: {
      rawScore: {
        $add: [
          { $ifNull: ['$scoreBreakdown.affordability', 0] },
          { $ifNull: ['$scoreBreakdown.jobOpportunities', 0] },
          { $ifNull: ['$scoreBreakdown.scholarships', 0] },
          { $ifNull: ['$scoreBreakdown.visaFriendliness', 0] },
          { $ifNull: ['$scoreBreakdown.safetyIndex', 0] }
        ]
      }
    }
  });

  pipeline.push({
    $addFields: {
      matchPercentage: {
        $cond: [
          { $gt: ['$totalApplicableWeightDoc', 0] },
          { $round: [{ $multiply: [{ $divide: ['$rawScore', '$totalApplicableWeightDoc'] }, 100] }, 0] },
          0
        ]
      }
    }
  });

  pipeline.push({
    $sort: { matchPercentage: -1, name: 1 }
  });

  return pipeline;
};
