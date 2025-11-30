/**
 * Message Routes
 */

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

router.get('/conversations', protect, messageController.getConversations);
router.get('/:conversationId', protect, messageController.getMessages);
router.post('/', protect, validateMessage, messageController.sendMessage);
router.put('/:conversationId/read', protect, messageController.markConversationRead);

module.exports = router;