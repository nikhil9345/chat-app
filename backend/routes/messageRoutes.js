const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  getPinnedMessages,
  deleteForMe,
  deleteForEveryone,
  togglePin,
} = require('../controllers/messageController');

router.get('/pinned', getPinnedMessages);

router.post('/', createMessage);
router.get('/', getMessages);

router.delete('/:id/me', deleteForMe);
router.delete('/:id/everyone', deleteForEveryone);

router.patch('/:id/pin', togglePin);

module.exports = router;