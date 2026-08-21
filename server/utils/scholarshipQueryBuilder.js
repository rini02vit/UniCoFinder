/**
 * Scholarship Query Builder Utility
 * Constructs MongoDB aggregation pipeline for Scholarship Recommendations
 */

export const buildScholarshipRecommendationPipeline = (user) => {
  const pipeline = [];

  const RECOMMENDATION_WEIGHTS = {
    cgpa: 30,
    degree: 30,
    course: 20,
    country: 20,
  };

  const scoreBreakdown = {};
  const totalApplicableWeightExprs = [];
  const evaluatedCategoriesCountExprs = [];

  // --- Category 1: CGPA ---
  // Evaluated if user has cgpa AND scholarship has minimumCgpa
  const hasUserCgpa = user && user.cgpa !== undefined && user.cgpa !== null;
  const hasScholarshipCgpa = { $ne: [{ $type: '$minimumCgpa' }, 'missing'] };
  const hasCgpaData = hasUserCgpa ? hasScholarshipCgpa : false;

  scoreBreakdown.cgpa = {
    $cond: [
      hasCgpaData,
      {
        $cond: [
          { $gte: [user ? user.cgpa : 0, '$minimumCgpa'] },
          RECOMMENDATION_WEIGHTS.cgpa,
          0
        ]
      },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasCgpaData, RECOMMENDATION_WEIGHTS.cgpa, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [{ $ne: [{ $type: '$minimumCgpa' }, 'missing'] }, 1, 0] });

  // --- Category 2: Degree ---
  const hasUserDegree = user && user.degree;
  const hasScholarshipDegree = { $gt: [{ $size: { $ifNull: ['$degreeLevels', []] } }, 0] };
  const hasDegreeData = hasUserDegree ? hasScholarshipDegree : false;

  scoreBreakdown.degree = {
    $cond: [
      hasDegreeData,
      {
        $cond: [
          {
            $in: [
              user && user.degree ? user.degree.toLowerCase() : '',
              {
                $map: {
                  input: { $ifNull: ['$degreeLevels', []] },
                  as: 'dl',
                  in: { $toLower: '$$dl' }
                }
              }
            ]
          },
          RECOMMENDATION_WEIGHTS.degree,
          0
        ]
      },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasDegreeData, RECOMMENDATION_WEIGHTS.degree, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [hasScholarshipDegree, 1, 0] });

  // --- Category 3: Course ---
  const hasUserCourse = user && user.course;
  const hasScholarshipCourse = { $gt: [{ $size: { $ifNull: ['$courses', []] } }, 0] };
  const hasCourseData = hasUserCourse ? hasScholarshipCourse : false;

  scoreBreakdown.course = {
    $cond: [
      hasCourseData,
      {
        $cond: [
          {
            $in: [
              user && user.course ? user.course.toLowerCase() : '',
              {
                $map: {
                  input: { $ifNull: ['$courses', []] },
                  as: 'c',
                  in: { $toLower: '$$c' }
                }
              }
            ]
          },
          RECOMMENDATION_WEIGHTS.course,
          0
        ]
      },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasCourseData, RECOMMENDATION_WEIGHTS.course, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [hasScholarshipCourse, 1, 0] });

  // --- Category 4: Country ---
  const hasUserCountry = user && user.countryPreference;
  const hasScholarshipCountry = { $ne: [{ $type: '$country' }, 'missing'] };
  const hasCountryData = hasUserCountry ? hasScholarshipCountry : false;

  scoreBreakdown.country = {
    $cond: [
      hasCountryData,
      {
        $cond: [
          { $eq: [{ $toLower: '$country' }, user && user.countryPreference ? user.countryPreference.toLowerCase() : ''] },
          RECOMMENDATION_WEIGHTS.country,
          0
        ]
      },
      0
    ]
  };

  totalApplicableWeightExprs.push({ $cond: [hasCountryData, RECOMMENDATION_WEIGHTS.country, 0] });
  evaluatedCategoriesCountExprs.push({ $cond: [hasScholarshipCountry, 1, 0] });

  pipeline.push({
    $addFields: {
      scoreBreakdown: scoreBreakdown,
      totalApplicableWeightDoc: { $add: totalApplicableWeightExprs.length > 0 ? totalApplicableWeightExprs : [0] },
      evaluatedCategoriesCount: { $add: evaluatedCategoriesCountExprs.length > 0 ? evaluatedCategoriesCountExprs : [0] }
    }
  });

  // Minimum data quality rule (at least 2 evaluated categories per scholarship)
  pipeline.push({
    $match: {
      evaluatedCategoriesCount: { $gte: 2 }
    }
  });

  // Calculate Match Percentage
  pipeline.push({
    $addFields: {
      rawScore: {
        $add: [
          { $ifNull: ['$scoreBreakdown.cgpa', 0] },
          { $ifNull: ['$scoreBreakdown.degree', 0] },
          { $ifNull: ['$scoreBreakdown.course', 0] },
          { $ifNull: ['$scoreBreakdown.country', 0] }
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

  // Deterministic Sort
  pipeline.push({
    $sort: { matchPercentage: -1, applicationDeadline: 1, name: 1 }
  });

  return pipeline;
};
