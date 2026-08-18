import University from '../models/University.js';
import Country from '../models/Country.js';
import Application from '../models/Application.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import Scholarship from '../models/Scholarship.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import { isValidObjectId } from 'mongoose';

const ALLOWED_FIELDS = [
  'name', 'country', 'city', 'degreeLevels', 'courses', 'tuitionFee', 
  'currency', 'ranking', 'cgpaRequirement', 'acceptanceRate', 'livingCost', 
  'englishExamRequirements', 'intakeMonths', 'applicationDeadline', 
  'website', 'gallery', 'description'
];

const checkForUnknownFields = (body) => {
  const keys = Object.keys(body);
  const unknown = keys.filter(key => !ALLOWED_FIELDS.includes(key));
  if (unknown.length > 0) {
    throw new Error(`Unknown fields provided: ${unknown.join(', ')}`);
  }
};

const validateCountryExists = async (countryName) => {
  const country = await Country.findOne({ name: { $regex: new RegExp(`^${countryName.trim()}$`, 'i') } });
  if (!country) {
    throw new Error(`Country '${countryName}' does not exist in the database. Please create it first.`);
  }
  return country.name; // Return exactly cased name from DB
};

// @desc    Get all universities (Admin)
// @route   GET /api/admin/universities
// @access  Private/Admin
export const getUniversities = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const filter = {};

    if (req.query.search) {
      const regex = new RegExp(req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { name: { $regex: regex } },
        { country: { $regex: regex } },
        { city: { $regex: regex } }
      ];
    }

    const sort = {};
    if (req.query.sortBy && ['name', 'ranking', 'createdAt', 'tuitionFee'].includes(req.query.sortBy)) {
      sort[req.query.sortBy] = req.query.order === 'desc' ? -1 : 1;
    } else {
      sort.ranking = 1;
    }

    const [universities, total] = await Promise.all([
      University.find(filter).skip(skip).limit(limit).sort(sort),
      University.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: universities,
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

// @desc    Get single university
// @route   GET /api/admin/universities/:id
// @access  Private/Admin
export const getUniversityById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.status(200).json({ success: true, data: university });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Create university
// @route   POST /api/admin/universities
// @access  Private/Admin
export const createUniversity = async (req, res) => {
  try {
    checkForUnknownFields(req.body);
    
    let { name, country, ...otherFields } = req.body;

    if (!name || !country) {
      return res.status(400).json({ success: false, message: 'Name and country are required.' });
    }

    // Validate Relationship
    const exactCountryName = await validateCountryExists(country);

    // Duplicate Check
    const existing = await University.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      country: exactCountryName 
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'University with this name already exists in this country.' });
    }

    const university = await University.create({
      name: name.trim(),
      country: exactCountryName,
      ...otherFields
    });

    res.status(201).json({ success: true, data: university });
  } catch (error) {
    if (error.message.includes('Unknown fields') || error.message.includes('does not exist')) {
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

// @desc    Update university
// @route   PUT /api/admin/universities/:id
// @access  Private/Admin
export const updateUniversity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    checkForUnknownFields(req.body);

    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    let exactCountryName = university.country;
    if (req.body.country && req.body.country !== university.country) {
      exactCountryName = await validateCountryExists(req.body.country);
    }

    // Duplicate check on rename
    if (req.body.name || req.body.country) {
      const newName = req.body.name ? req.body.name.trim() : university.name;
      const existing = await University.findOne({ 
        _id: { $ne: university._id },
        name: { $regex: new RegExp(`^${newName}$`, 'i') },
        country: exactCountryName
      });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Another university with this name already exists in this country.' });
      }
    }

    const updateData = {};
    for (const key of ALLOWED_FIELDS) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }
    
    if (updateData.country) {
      updateData.country = exactCountryName;
    }

    Object.assign(university, updateData);
    await university.save();

    res.status(200).json({ success: true, data: university });
  } catch (error) {
    if (error.message.includes('Unknown fields') || error.message.includes('does not exist')) {
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

// @desc    Delete university
// @route   DELETE /api/admin/universities/:id
// @access  Private/Admin
export const deleteUniversity = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    // Check for references
    const [appCount, reviewCount, wishlistCount, scholarshipCount] = await Promise.all([
      Application.countDocuments({ university: university._id }),
      Review.countDocuments({ university: university._id }),
      User.countDocuments({ 'wishlist.university': university._id }),
      Scholarship.countDocuments({ university: university._id })
    ]);

    if (appCount > 0 || reviewCount > 0 || wishlistCount > 0 || scholarshipCount > 0) {
      return res.status(409).json({ 
        success: false, 
        message: `Cannot delete university. It is referenced by ${appCount} applications, ${reviewCount} reviews, ${wishlistCount} wishlists, and ${scholarshipCount} scholarships.` 
      });
    }

    // Also remove it from Country.popularUniversities if it's there
    await Country.updateMany(
      { popularUniversities: university._id },
      { $pull: { popularUniversities: university._id } }
    );

    await university.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};
