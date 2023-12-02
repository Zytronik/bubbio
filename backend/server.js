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
let connectedUsers = 0;

app.get('/', (req, res) => {
  res.send('<title>blubbio | Server</title><h1>Blubb... i am the Server</h1>');
});

io.on('connection', (socket) => {
  connectedUsers++;
  logRoomInformation('User connected');

  socket.on('joinRoom', (data) => {
    // Create the room if it doesn't exist
    if (!rooms.has(data.roomId)) {
      rooms.set(data.roomId, []);
    }
    socket.join(data.roomId);
    io.to(data.roomId).emit('message', { user: 'Server', text: `${data.user} joined the room: ${data.roomId}` });
    rooms.get(data.roomId).push({ user: 'Server', text: `${data.user} joined the room: ${data.roomId}` });
    logRoomInformation('User joined a room');
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
      logRoomInformation('User left a room');
    } else {
      console.log(`${data.user} is trying to leave a room without being in one`);
    }
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    // Remove the user from all rooms
    rooms.forEach((users, roomId) => {
      const index = users.findIndex((u) => u.id === socket.id);
      if (index !== -1) {
        users.splice(index, 1);
        // Delete the room if there are no users left
        if (users.length === 0) {
          rooms.delete(roomId);
        }
      }
    });
    logRoomInformation('User disconnected');
  });

  function logRoomInformation(event) {
    console.log(`--Event--`);
    console.log(event);
    console.log(`--Connected Users--`);
    console.log(connectedUsers);
    console.log('--Rooms and Users--');
    if(rooms.size > 0) {
      rooms.forEach((users, roomId) => {
        console.log(`Room ${roomId}: ${users.length} users`);
      });
    }else{
      console.log("no rooms");
    }
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  } 
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
