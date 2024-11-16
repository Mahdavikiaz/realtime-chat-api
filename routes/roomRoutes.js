const express = require('express');
const roomController = require('../controllers/roomController.js');
const router = express.Router();

// routes
router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
