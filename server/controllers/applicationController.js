const Application = require('../models/Application');
const JobRole = require('../models/JobRole');
const ActivityLog = require('../models/ActivityLog');

// Create application
const createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      applicant: req.user._id
    });

    // Log activity
    await ActivityLog.create({
      application: application._id,
      action: 'Application submitted',
      newStatus: 'applied',
      performedBy: req.user._id,
      performedByRole: req.user.role
    });

    const populatedApp = await Application.findById(application._id)
      .populate('jobRole', 'title type')
      .populate('applicant', 'username email');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applications (role-based)
const getApplications = async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'applicant') {
      query.applicant = req.user._id;
    } else if (req.user.role === 'bot') {
      // Bot only sees technical role applications
      const technicalRoles = await JobRole.find({ type: 'technical' });
      query.jobRole = { $in: technicalRoles.map(role => role._id) };
    }
    // Admin sees all applications

    const applications = await Application.find(query)
      .populate('jobRole', 'title type department')
      .populate('applicant', 'username email profile')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application with activity log
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobRole', 'title type department')
      .populate('applicant', 'username email profile');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check access permissions
    if (req.user.role === 'applicant' && 
        application.applicant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const activityLog = await ActivityLog.find({ application: application._id })
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({ application, activityLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Admin/Bot)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    // Log activity
    await ActivityLog.create({
      application: application._id,
      action: `Status updated to ${status}`,
      previousStatus,
      newStatus: status,
      comment,
      performedBy: req.user._id,
      performedByRole: req.user.role,
      isAutomated: req.user.role === 'bot'
    });

    const updatedApp = await Application.findById(application._id)
      .populate('jobRole', 'title type')
      .populate('applicant', 'username email');

    res.json({
      message: 'Application status updated successfully',
      application: updatedApp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.role === 'applicant') {
      const myApplications = await Application.find({ applicant: req.user._id });
      stats = {
        totalApplications: myApplications.length,
        statusBreakdown: myApplications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {})
      };
    } else {
      let query = {};
      if (req.user.role === 'bot') {
        const technicalRoles = await JobRole.find({ type: 'technical' });
        query.jobRole = { $in: technicalRoles.map(role => role._id) };
      }

      const applications = await Application.find(query);
      const recentActivity = await ActivityLog.find(
        req.user.role === 'bot' ? { isAutomated: true } : {}
      ).limit(10).sort({ createdAt: -1 });

      stats = {
        totalApplications: applications.length,
        statusBreakdown: applications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {}),
        recentActivity: recentActivity.length
      };
    }

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  getDashboardStats
};