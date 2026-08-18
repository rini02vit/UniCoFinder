import Scholarship from '../models/Scholarship.js';
import Country from '../models/Country.js';
import University from '../models/University.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import { isValidObjectId } from 'mongoose';

const ALLOWED_FIELDS = [
  'name', 'provider', 'country', 'university', 'description', 
  'minimumCgpa', 'degreeLevels', 'courses', 'eligibleCountries', 
  'englishExamRequirements', 'amount', 'currency', 'coverageType', 
  'applicationDeadline', 'website'
];

const checkForUnknownFields = (body) => {
  const keys = Object.keys(body);
  const unknown = keys.filter(key => !ALLOWED_FIELDS.includes(key));
  if (unknown.length > 0) {
    throw new Error(`Unknown fields provided: ${unknown.join(', ')}`);
  }
};

const validateRelationships = async (countryName, universityId) => {
  let exactCountryName = undefined;
  if (countryName) {
    const country = await Country.findOne({ name: { $regex: new RegExp(`^${countryName.trim()}$`, 'i') } });
    if (!country) {
      throw new Error(`Country '${countryName}' does not exist.`);
    }
    exactCountryName = country.name;
  }

  if (universityId) {
    if (!isValidObjectId(universityId)) {
      throw new Error('Invalid University ID format.');
    }
    const uni = await University.findById(universityId);
    if (!uni) {
      throw new Error('University does not exist.');
    }
  }

  return exactCountryName;
};

// @desc    Get all scholarships (Admin)
// @route   GET /api/admin/scholarships
// @access  Private/Admin
export const getScholarships = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const filter = {};

    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: { $regex: regex } },
        { provider: { $regex: regex } },
        { country: { $regex: regex } }
      ];
    }

    const sort = {};
    if (req.query.sortBy && ['name', 'amount', 'applicationDeadline', 'createdAt'].includes(req.query.sortBy)) {
      sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Newest first by default
    }

    const [scholarships, total] = await Promise.all([
      Scholarship.find(filter).skip(skip).limit(limit).sort(sort).populate('university', 'name'),
      Scholarship.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: scholarships,
      pagination: {
        page,
        limit,
        totalDocs: total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Get single scholarship
// @route   GET /api/admin/scholarships/:id
// @access  Private/Admin
export const getScholarshipById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const scholarship = await Scholarship.findById(req.params.id).populate('university', 'name');
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Create scholarship
// @route   POST /api/admin/scholarships
// @access  Private/Admin
export const createScholarship = async (req, res) => {
  try {
    checkForUnknownFields(req.body);
    
    let { name, provider, country, university, coverageType, ...otherFields } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    // Validate Enums
    if (coverageType && !['Full', 'Partial', 'Tuition', 'Living'].includes(coverageType)) {
      return res.status(400).json({ success: false, message: 'Invalid coverage type.' });
    }

    // Validate Relationships
    const exactCountryName = await validateRelationships(country, university);

    // Duplicate Check
    const existing = await Scholarship.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      provider: provider ? { $regex: new RegExp(`^${provider.trim()}$`, 'i') } : null
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'Scholarship with this name and provider already exists.' });
    }

    const scholarship = await Scholarship.create({
      name: name.trim(),
      provider: provider ? provider.trim() : undefined,
      country: exactCountryName,
      university: university || undefined,
      coverageType,
      ...otherFields
    });

    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    if (error.message.includes('Unknown fields') || error.message.includes('does not exist') || error.message.includes('Invalid')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value provided for field: ${error.path}` });
    }
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Update scholarship
// @route   PUT /api/admin/scholarships/:id
// @access  Private/Admin
export const updateScholarship = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    checkForUnknownFields(req.body);

    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    let exactCountryName = scholarship.country;
    if (req.body.country !== undefined || req.body.university !== undefined) {
      const newCountry = req.body.country !== undefined ? req.body.country : scholarship.country;
      const newUni = req.body.university !== undefined ? req.body.university : scholarship.university;
      exactCountryName = await validateRelationships(newCountry, newUni);
    }

    // Validate Enums
    if (req.body.coverageType && !['Full', 'Partial', 'Tuition', 'Living'].includes(req.body.coverageType)) {
      return res.status(400).json({ success: false, message: 'Invalid coverage type.' });
    }

    // Duplicate check on rename
    if (req.body.name || req.body.provider !== undefined) {
      const newName = req.body.name ? req.body.name.trim() : scholarship.name;
      const newProvider = req.body.provider !== undefined ? (req.body.provider ? req.body.provider.trim() : null) : scholarship.provider;
      
      const existing = await Scholarship.findOne({ 
        _id: { $ne: scholarship._id },
        name: { $regex: new RegExp(`^${newName}$`, 'i') },
        provider: newProvider ? { $regex: new RegExp(`^${newProvider}$`, 'i') } : null
      });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Another scholarship with this name and provider already exists.' });
      }
    }

    const updateData = {};
    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
    
    if (req.body.country !== undefined) {
      updateData.country = exactCountryName || null; // Allow clearing country
    }

    Object.assign(scholarship, updateData);
    await scholarship.save();

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    if (error.message.includes('Unknown fields') || error.message.includes('does not exist') || error.message.includes('Invalid')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value provided for field: ${error.path}` });
    }
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Delete scholarship
// @route   DELETE /api/admin/scholarships/:id
// @access  Private/Admin
export const deleteScholarship = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    // Scholarship has no persistent user activity references. Safe to hard delete.
    await scholarship.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};
