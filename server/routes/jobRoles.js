const express = require('express');
const {
  createJobRole,
  getJobRoles,
  getJobRole,
  updateJobRole,
  deleteJobRole
} = require('../controllers/jobRoleController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/job-roles:
 *   post:
 *     summary: Create new job role (Admin only)
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authorize('admin'), createJobRole);

/**
 * @swagger
 * /api/job-roles:
 *   get:
 *     summary: Get all job roles
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', getJobRoles);

/**
 * @swagger
 * /api/job-roles/{id}:
 *   get:
 *     summary: Get single job role
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', getJobRole);

/**
 * @swagger
 * /api/job-roles/{id}:
 *   put:
 *     summary: Update job role (Admin only)
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authorize('admin'), updateJobRole);

/**
 * @swagger
 * /api/job-roles/{id}:
 *   delete:
 *     summary: Delete job role (Admin only)
 *     tags: [Job Roles]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authorize('admin'), deleteJobRole);

module.exports = router;