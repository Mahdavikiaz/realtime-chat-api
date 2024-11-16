const Room = require('../models/Room.js');

// get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// create new room
exports.createRoom = async (req, res) => {
  const { name, description, isPrivate } = req.body;
  try {
    const roomExists = await Room.findOne({ name });
    if (roomExists) {
      return res
        .status(400)
        .json({ error: 'Room with this name already exists.' });
    }
    const room = await Room.create({ name, description, isPrivate });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get room by id
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findById(id);
    if (!room) {
      res.status(404).json({ error: 'Room not found.' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update room
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, description, isPrivate } = req.body;
  try {
    const room = await Room.findByIdAndUpdate(
      id,
      { name, description, isPrivate },
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ error: 'Room not found.' });
    }
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete room
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found.' });
    }
    res.status(200).json({ message: 'Room deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
