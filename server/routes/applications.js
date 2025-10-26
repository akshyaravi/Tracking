const express = require('express');
const {
  createApplication,
  getApplications,
  getApplication,
  updateApplicationStatus,
  getDashboardStats
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Create new application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize('applicant'), createApplication);

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications (role-based access)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getApplications);

/**
 * @swagger
 * /api/applications/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get single application with activity log
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getApplication);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   put:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id/status', authorize('admin', 'bot'), updateApplicationStatus);

module.exports = router;