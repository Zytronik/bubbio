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
let connectedUsers = [];

app.get('/', (req, res) => {
  res.send('<title>blubbio | Server</title><h1>Blubb... i am the Server</h1>');
});

io.on('connection', (socket) => {
  //regist new user
  connectedUsers.push({
    user: {
      socketId: socket.id,
      username: 'User-' + Math.random().toString(36).substring(5),
    }
  });

  const username = getUsername(socket.id);

  logRoomsInformations('User connected');

  socket.on('joinRoom', (data) => {
    // Create the room if it doesn't exist
    if (!rooms.has(data.roomId)) {
      rooms.set(data.roomId, { messages: [], users: [] });
    }
    socket.join(data.roomId); //join socket
    io.to(data.roomId).emit('message', { user: 'Server', text: `${username} joined the room: ${data.roomId}` }); //send User joined msg to room
    rooms.get(data.roomId).messages.push({ user: 'Server', text: `${username} joined the room: ${data.roomId}` }); //save User joined msg in room obj
    rooms.get(data.roomId).users.push(socket.id); //add User to rooms obj
    logRoomsInformations('User joined a room');
  });

  socket.on('message', (data) => {
    const roomId = getCurrentRoom(socket.id);
    io.to(roomId).emit('message', { user: username, text: data.text }); // send message to room
    rooms.get(roomId).messages.push({ user: 'Server', text: `${username} joined the room: ${data.roomId}` }); //save message in room obj
    logRoomsInformations("Messages was send");
  });

  socket.on('leaveRoom', () => {
    const roomId = getCurrentRoom(socket.id);
    if (roomId) { // if is in a room
      socket.leave(roomId); // leave room
      io.to(roomId).emit('message', { user: 'Server', text: `${username} left the room: ${roomId}` }); // send leave msg to room
      rooms.get(roomId).messages.push({ user: 'Server', text: `${username} left the room: ${roomId}` }); // save leave msg in room obj
      removeElementFromArray(rooms.get(roomId).users, socket.id); //remove user from rooms obj
      deleteEmptyRooms(); // delete empty rooms
      logRoomsInformations('User left a room');
    } else {
      console.log(`${data.user} is trying to leave a room without being in one`);
    }
  });

  socket.on('leftPage', () => {
    const roomId = getCurrentRoom(socket.id);
    if(roomId){
      io.to(roomId).emit('message', { user: 'Server', text: `${username} left the room: ${roomId}` }); // send leave msg to room
      rooms.get(roomId).messages.push({ user: 'Server', text: `${username} left the room: ${roomId}` }); // save leave msg in room obj
    }
    removeUserFromAllRooms(socket.id); // remove User from rooms Obj
    deleteEmptyRooms(); //delete Empty rooms
    removeUser(socket.id); //remove User from connectedUsers Array
    logRoomsInformations('User left page');
  });

  socket.on('disconnecting', () => {
    const roomId = getCurrentRoom(socket.id);
    if(roomId){
      io.to(roomId).emit('message', { user: 'Server', text: `${username} left the room: ${roomId}` }); // send leave msg to room
      rooms.get(roomId).messages.push({ user: 'Server', text: `${username} left the room: ${roomId}` }); // save leave msg in room obj
    }
    removeUserFromAllRooms(socket.id); // remove User from rooms Obj
    deleteEmptyRooms(); //delete Empty rooms
    removeUser(socket.id); //remove User from connectedUsers Array
    logRoomsInformations('User disconnected');
  });

  function getCurrentRoom(socketId) {
    for (const [roomId, room] of rooms.entries()) {
      if (room.users && room.users.includes(socketId)) {
        return roomId;
      }
    }
    return null;
  }

  function removeElementFromArray(array, value) {
    const index = array.indexOf(value);

    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  function removeUserFromAllRooms(socketIdToRemove) {
    rooms.forEach((room) => {
      if (room.users && room.users.includes(socketIdToRemove)) {
        room.users = room.users.filter(socketId => socketId !== socketIdToRemove);
      }
    });
  }

  function removeUser(socketId) {
    let indexToRemove = -1;
    connectedUsers.forEach((entry, index) => {
      if (entry.user.socketId === socketId) {
        indexToRemove = index;
      }
    });
    if (indexToRemove !== -1) {
      connectedUsers.splice(indexToRemove, 1)[0];
    }
  }

  function getUsername(socketId) {
    let r;
    connectedUsers.forEach((entry) => {
      if (entry.user.socketId == socketId) {
        r = entry.user.username;
        return r;
      }
    });
    return r;
  }

  function deleteEmptyRooms() {
    rooms.forEach((room, roomId) => {
      if (room.users && room.users.length === 0) {
        rooms.delete(roomId);
      }
    });
  }

  function logRoomsInformations(eventMsg) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.log(`--Event--`);
    console.log(eventMsg);
    console.log(`--Connected Users--`);
    /* console.log(connectedUsers); */
    console.log(connectedUsers.length);
    console.log('--Rooms and Users--');
    if (rooms.size > 0) {
      /* console.log(rooms); */
      for (let [roomId, data] of rooms) {
        console.log(`Room ${roomId}: ${data.users.length} users`);
      }
    } else {
      console.log("no rooms");
    }
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
  }

});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
