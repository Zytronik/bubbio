const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    //origin: "https://bubbio-2qce6.ondigitalocean.app",
    origin: "*",
    methods: ["GET", "POST"]
  },
  //path: "/bubbio-backend",
});

app.get('/', (req, res) => {
  res.send('<h1>Hello Server</h1>');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (data) => {
    console.log('Message from client:', data);
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(8080, () => {
  console.log(`Server running on http://localhost:8080`);
});
