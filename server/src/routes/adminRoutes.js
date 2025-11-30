/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/dashboard', protect, admin, adminController.getDashboard);
router.get('/users', protect, admin, adminController.listUsers);
router.post('/users/:id/deactivate', protect, admin, adminController.deactivateUser);
router.post('/deals/:id/force-complete', protect, admin, adminController.forceCompleteDeal);
router.delete('/skills/:id', protect, admin, adminController.removeSkill);

module.exports = router;