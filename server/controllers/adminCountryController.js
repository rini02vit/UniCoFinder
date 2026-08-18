import Country from '../models/Country.js';
import University from '../models/University.js';
import Scholarship from '../models/Scholarship.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import { isValidObjectId } from 'mongoose';

const ALLOWED_FIELDS = [
  'name', 'code', 'capital', 'currency', 'language', 'continent',
  'averageTuitionFee', 'averageLivingCost', 'visaRequirements',
  'workPermit', 'postStudyWorkVisa', 'visaFriendlinessScore', 'safetyIndex', 'description'
];

const checkForUnknownFields = (body) => {
  const keys = Object.keys(body);
  const unknown = keys.filter(key => !ALLOWED_FIELDS.includes(key));
  if (unknown.length > 0) {
    throw new Error(`Unknown fields provided: ${unknown.join(', ')}`);
  }
};

// @desc    Get all countries (Admin)
// @route   GET /api/admin/countries
// @access  Private/Admin
export const getCountries = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const filter = {};

    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: { $regex: regex } },
        { code: { $regex: regex } },
        { continent: { $regex: regex } }
      ];
    }

    const sort = {};
    if (req.query.sortBy && ['name', 'createdAt'].includes(req.query.sortBy)) {
      sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    } else {
      sort.name = 1;
    }

    const [countries, total] = await Promise.all([
      Country.find(filter).skip(skip).limit(limit).sort(sort),
      Country.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: countries,
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

// @desc    Get single country
// @route   GET /api/admin/countries/:id
// @access  Private/Admin
export const getCountryById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }
    res.status(200).json({ success: true, data: country });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Create country
// @route   POST /api/admin/countries
// @access  Private/Admin
export const createCountry = async (req, res) => {
  try {
    checkForUnknownFields(req.body);
    
    // Explicit destructuring for safety
    const {
      name, code, capital, currency, language, continent,
      averageTuitionFee, averageLivingCost, visaRequirements,
      workPermit, postStudyWorkVisa, visaFriendlinessScore, safetyIndex, description
    } = req.body;

    const existing = await Country.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Country with this name already exists' });
    }

    const country = await Country.create({
      name, code, capital, currency, language, continent,
      averageTuitionFee, averageLivingCost, visaRequirements,
      workPermit, postStudyWorkVisa, visaFriendlinessScore, safetyIndex, description
    });

    res.status(201).json({ success: true, data: country });
  } catch (error) {
    if (error.message.includes('Unknown fields')) {
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

// @desc    Update country
// @route   PUT /api/admin/countries/:id
// @access  Private/Admin
export const updateCountry = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    checkForUnknownFields(req.body);

    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }

    // Name is IMMUTABLE
    if (req.body.name && req.body.name !== country.name) {
      return res.status(400).json({ success: false, message: 'Country name is immutable. Delete and recreate to rename.' });
    }

    // Safe extraction
    const updateData = {};
    for (const key of ALLOWED_FIELDS) {
      if (key !== 'name' && req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    // Set fields, bypassing findByIdAndUpdate for schema hooks and strict control
    Object.assign(country, updateData);
    await country.save();

    res.status(200).json({ success: true, data: country });
  } catch (error) {
    if (error.message.includes('Unknown fields')) {
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

// @desc    Delete country
// @route   DELETE /api/admin/countries/:id
// @access  Private/Admin
export const deleteCountry = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const country = await Country.findById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }

    // Check for references
    const [uniCount, scholarshipCount] = await Promise.all([
      University.countDocuments({ country: country.name }),
      Scholarship.countDocuments({ country: country.name })
    ]);

    if (uniCount > 0 || scholarshipCount > 0) {
      return res.status(409).json({ 
        success: false, 
        message: `Cannot delete country. It is referenced by ${uniCount} universities and ${scholarshipCount} scholarships.` 
      });
    }

    await country.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};
