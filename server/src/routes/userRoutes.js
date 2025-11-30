/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.get('/me', protect, userController.getMe);
router.get('/public/:username', userController.getPublicProfile);
router.put('/me', protect, upload.single('avatar'), userController.updateProfile);
router.put('/me/password', protect, userController.changePassword);
router.post('/me/disable', protect, userController.disableAccount);
router.delete('/me/avatar', protect, userController.removeAvatar);
router.get('/', protect, userController.listUsers);

module.exports = router;