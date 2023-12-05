const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

app.get('/', (req, res) => {
  res.send('<title>blubbio | Server</title><h1>Blubb... i am the Server</h1>');
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});

module.exports = { 
  io: io,
};