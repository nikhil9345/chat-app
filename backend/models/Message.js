const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  sender: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true,
  },
  senderId: {
    type: String,
    required: [true, 'Sender ID is required'],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  deletedFor: {
    type: [String],
    default: [],
  },
  isDeletedForEveryone: {
    type: Boolean,
    default: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Message', messageSchema);