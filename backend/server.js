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

  socket.on('joinRoom', (data) => {
    if (!rooms.has(data.roomId)) {
      rooms.set(data.roomId, []);
    }
    socket.join(data.roomId);
    io.to(data.roomId).emit('message', { user: 'Server', text: `${data.user} joined the room: ${data.roomId}` });
    rooms.get(data.roomId).push({ user: 'Server', text: `${data.user} joined the room: ${data.roomId}` });
  });

  socket.on('message', (data) => {
    const roomId = Array.from(socket.rooms)[1]; // Assuming the first room is the actual chat room
    io.to(roomId).emit('message', data);
    rooms.get(roomId).push(data);
  });

  socket.on('leaveRoom', (data) => {
    const roomsArray = Array.from(socket.rooms);
    if (roomsArray.length > 1) {
      const roomId = roomsArray[1];
      socket.leave(roomId);
      io.to(roomId).emit('message', { user: 'Server', text: `${data.user} left the room: ${roomId}` });
      rooms.get(roomId).push({ user: 'Server', text: `${data.user} left the room: ${roomId}` });
    } else {
      console.log(`${data.user} is trying to leave a room without being in one`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
