/**
 * University Query Builder Utility
 * Strictly responsible for constructing MongoDB query components.
 * Does NOT execute queries or import models.
 */

export const buildPagination = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }

  if (isNaN(limit) || limit <= 0) {
    limit = 10;
  } else if (limit > 50) {
    limit = 50;
  }

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildSort = (query) => {
  const allowedSortFields = ['ranking', 'name', 'tuitionFee'];
  const allowedOrders = ['asc', 'desc'];

  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'ranking';
  const order = allowedOrders.includes(query.order) ? query.order : 'asc';

  const sortValue = order === 'asc' ? 1 : -1;
  
  // Always include a secondary sort on name for consistent results
  if (sortBy === 'name') {
    return { name: sortValue };
  }
  
  return { [sortBy]: sortValue, name: 1 };
};

export const buildSearchFilter = (keyword) => {
  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    return null; // Signals invalid search
  }

  // Escape regex special characters to prevent ReDoS or injection
  const escapedKeyword = keyword.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedKeyword, 'i');

  return {
    $or: [
      { name: { $regex: regex } },
      { country: { $regex: regex } },
      { city: { $regex: regex } },
      { description: { $regex: regex } },
    ],
  };
};

export const buildFilter = (query) => {
  const filter = {};

  if (query.country && typeof query.country === 'string' && query.country.trim() !== '') {
    const escapedCountry = query.country.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.country = { $regex: new RegExp(`^${escapedCountry}$`, 'i') }; // Exact case-insensitive match
  }

  if (query.degree && typeof query.degree === 'string' && query.degree.trim() !== '') {
    filter.degreeLevels = query.degree.trim();
  }

  if (query.minTuition || query.maxTuition) {
    filter.tuitionFee = {};
    if (query.minTuition && !isNaN(Number(query.minTuition))) {
      filter.tuitionFee.$gte = Number(query.minTuition);
    }
    if (query.maxTuition && !isNaN(Number(query.maxTuition))) {
      filter.tuitionFee.$lte = Number(query.maxTuition);
    }
    // If neither were valid numbers, remove the empty object
    if (Object.keys(filter.tuitionFee).length === 0) {
      delete filter.tuitionFee;
    }
  }

  if (query.minRanking || query.maxRanking) {
    filter.ranking = {};
    if (query.minRanking && !isNaN(Number(query.minRanking))) {
      filter.ranking.$gte = Number(query.minRanking);
    }
    if (query.maxRanking && !isNaN(Number(query.maxRanking))) {
      filter.ranking.$lte = Number(query.maxRanking);
    }
    if (Object.keys(filter.ranking).length === 0) {
      delete filter.ranking;
    }
  }

  if (query.studentCgpa && !isNaN(Number(query.studentCgpa))) {
    filter.cgpaRequirement = { $lte: Number(query.studentCgpa) };
  }

  if (query.englishExam && typeof query.englishExam === 'string' && query.englishExam.trim() !== '') {
    filter.englishExamRequirements = query.englishExam.trim();
  }

  return filter;
};
