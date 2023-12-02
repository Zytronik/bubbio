const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

const rooms = new Map();

app.get('/', (req, res) => {
  res.send('<title>blubbio | Server</title><h1>Blubb... i am the Server</h1>');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (roomId) => {
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }
    socket.join(roomId);
    io.to(roomId).emit('message', { user: 'Server', text: `User joined the room: ${roomId}` });
    rooms.get(roomId).push({ user: 'Server', text: `User joined the room: ${roomId}` });
  });

  socket.on('message', (data) => {
    const roomId = Array.from(socket.rooms)[1]; // Assuming the first room is the actual chat room
    io.to(roomId).emit('message', data);
    rooms.get(roomId).push(data);
  });

  socket.on('leaveRoom', () => {
    const roomId = Array.from(socket.rooms)[1];
    socket.leave(roomId);
    io.to(roomId).emit('message', { user: 'Server', text: `User left the room: ${roomId}` });
    rooms.get(roomId).push({ user: 'Server', text: `User left the room: ${roomId}` });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
