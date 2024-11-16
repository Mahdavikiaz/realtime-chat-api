require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const userRoutes = require('./routes/userRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const roomRoutes = require('./routes/roomRoutes.js');
const Message = require('./models/Message.js');
const Room = require('./models/Room.js');
const auth = require('./middleware/authMiddleware.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());

// API
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.send('Realtime chat API is running,,,');
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // join room
  socket.on('joinRoom', async (roomId) => {
    const room = await Room.findById(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    socket.join(roomId);
    socket.emit('message', `Welcome to room ${room.name}`);
    console.log(`User ${socket.id} joined room: ${room.name}`);
  });

  // get message from client
  socket.on('sendMessage', (data) => {
    const { roomId, username, message } = data;
    if (!roomId || !message) {
      socket.emit('error', 'Invalid data');
      return;
    }
  });

  app.post('/api/chat/send-message', auth, (req, res) => {
    const { roomId, username, message } = req.body;
    // send message to correct room
    io.to(roomId).emit('receiveMessage', {
      username,
      message,
      timestamp: new Date().toISOString(),
    });
    res.json({ message: 'Message sent to room' });
  });

  // disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// database connection
const connectDB = require('./config/database.js');
const authenticate = require('./middleware/authMiddleware.js');
connectDB();

// limit request 100 per 15 minute
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many request, please try again later.',
});

app.use(limiter);
app.use(helmet());

const PORT = process.env.PORT || 300;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
