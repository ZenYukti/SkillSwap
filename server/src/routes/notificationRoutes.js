/**
 * Notification Routes
 */

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, notificationController.listNotifications);
router.put('/:id/read', protect, notificationController.markRead);
router.put('/read-all', protect, notificationController.markAllRead);

module.exports = router;