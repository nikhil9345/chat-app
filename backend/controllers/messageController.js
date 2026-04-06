const mongoose = require('mongoose');
const Message = require('../models/Message');

// CREATE MESSAGE
const createMessage = async (req, res) => {
  try {
    const { content, sender, senderId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content required' });
    }

    if (!senderId) {
      return res.status(400).json({ message: 'Sender ID required' });
    }

    const message = await Message.create({
      content: content.trim(),
      sender,
      senderId,
    });

    const io = req.app.get('io');
    io.emit('receiveMessage', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId required' });
    }

    let messages = await Message.find({
      deletedFor: { $nin: [userId] },
    }).sort({ isPinned: -1, timestamp: 1, _id: 1 });

    messages = messages.map((msg) => {
      const obj = msg.toObject();
      if (obj.isDeletedForEveryone) {
        obj.content = '🚫 This message was deleted';
      }
      return obj;
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET PINNED
const getPinnedMessages = async (req, res) => {
  try {
    const { userId } = req.query;

    const messages = await Message.find({
      isPinned: true,
      isDeletedForEveryone: false,
      deletedFor: { $nin: [userId] },
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE FOR ME
const deleteForMe = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId required' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (!message.deletedFor.includes(userId)) {
      message.deletedFor.push(userId);
      await message.save();
    }

    // NO SOCKET EMIT (important)

    res.json({ message: 'Deleted for you' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE FOR EVERYONE
const deleteForEveryone = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.isDeletedForEveryone) {
      return res.status(400).json({ message: 'Already deleted' });
    }

    message.isDeletedForEveryone = true;
    await message.save();

    const io = req.app.get('io');
    io.emit('messageDeleted', {
      messageId: message._id,
      type: 'everyone',
    });

    res.json({ message: 'Deleted for everyone' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// TOGGLE PIN
const togglePin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isPinned = !message.isPinned;
    await message.save();

    const io = req.app.get('io');
    io.emit('messagePinned', {
      messageId: message._id,
      isPinned: message.isPinned,
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getPinnedMessages,
  deleteForMe,
  deleteForEveryone,
  togglePin,
};