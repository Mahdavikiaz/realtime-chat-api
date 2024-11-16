const Message = require('../models/Message.js');

// get all messages from room
exports.getMessagesByRoom = async (req, res) => {
  const { room } = req.params;

  try {
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create new message
exports.createMessage = async (req, res) => {
  const { room, username, content } = req.body;
  try {
    const message = await Message.create({ room, username, content });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
