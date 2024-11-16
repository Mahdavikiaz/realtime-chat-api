const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');

  // join room
  socket.emit('joinRoom', '673890b451be174ecf801daa');

  // send message
  socket.emit('sendMessage', {
    roomId: '673890b451be174ecf801daa',
    username: 'user1',
    message: 'Hi, test chat di room sports.',
  });
});

socket.on('message', (message) => {
  console.log('Message from server:', message);
});

socket.on('receiveMessage', (data) => {
  console.log(`[${data.timestamp}] ${data.username}: ${data.message}`);
});

socket.on('error', (error) => {
  console.log('Error:', error);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
