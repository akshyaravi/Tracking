const express = require('express');
const {
  processAutomatedUpdates,
  getBotActivity,
  triggerApplicationUpdate
} = require('../controllers/botController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and bot role
router.use(authenticate);
router.use(authorize('bot', 'admin'));

/**
 * @swagger
 * /api/bot/process:
 *   post:
 *     summary: Process automated updates for technical applications
 *     tags: [Bot Operations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/process', processAutomatedUpdates);

/**
 * @swagger
 * /api/bot/activity:
 *   get:
 *     summary: Get bot activity summary
 *     tags: [Bot Operations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/activity', getBotActivity);

/**
 * @swagger
 * /api/bot/trigger/{applicationId}:
 *   post:
 *     summary: Manually trigger update for specific application
 *     tags: [Bot Operations]
 *     security:
 *       - bearerAuth: []
 */
router.post('/trigger/:applicationId', triggerApplicationUpdate);

module.exports = router;