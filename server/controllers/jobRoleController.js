const JobRole = require('../models/JobRole');

// Create job role (Admin only)
const createJobRole = async (req, res) => {
  try {
    const jobRole = await JobRole.create({
      ...req.body,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: 'Job role created successfully',
      jobRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all job roles
const getJobRoles = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    let query = {};

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const jobRoles = await JobRole.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ jobRoles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job role
const getJobRole = async (req, res) => {
  try {
    const jobRole = await JobRole.findById(req.params.id)
      .populate('createdBy', 'username email');

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({ jobRole });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update job role (Admin only)
const updateJobRole = async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({
      message: 'Job role updated successfully',
      jobRole
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job role (Admin only)
const deleteJobRole = async (req, res) => {
  try {
    const jobRole = await JobRole.findByIdAndDelete(req.params.id);

    if (!jobRole) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json({ message: 'Job role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJobRole,
  getJobRoles,
  getJobRole,
  updateJobRole,
  deleteJobRole
};