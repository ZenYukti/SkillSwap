/**
 * Skill Routes
 */

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const { validateSkill } = require('../middleware/validation');

router.get('/', skillController.listSkills);
router.get('/mine', protect, skillController.mySkills);
router.get('/:id', skillController.getSkill);
router.post('/', protect, validateSkill, skillController.createSkill);
router.put('/:id', protect, skillController.updateSkill);
router.delete('/:id', protect, skillController.deleteSkill);
router.post('/:id/view', skillController.incrementView);

module.exports = router;