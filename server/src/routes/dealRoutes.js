/**
 * Deal Routes
 */

const express = require('express');
const router = express.Router();
const dealController = require('../controllers/dealController');
const { protect } = require('../middleware/auth');
const { validateDeal } = require('../middleware/validation');

router.get('/', protect, dealController.listDeals);
router.post('/', protect, validateDeal, dealController.createDeal);
router.get('/:id', protect, dealController.getDeal);
router.put('/:id/status', protect, dealController.updateStatus);
router.post('/:id/review', protect, dealController.addReview);

module.exports = router;