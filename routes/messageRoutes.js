const express = require('express');
const messageController = require('../controllers/messageController.js');
const router = express.Router();

// get message by room
router.get('/:room', messageController.getMessagesByRoom);

// create message
router.post('/', messageController.createMessage);

module.exports = router;
