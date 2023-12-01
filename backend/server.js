const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Add this line

const app = express();
const server = http.createServer(app);

app.use(cors()); // Add this line

const io = socketIo(server, {
  cors: {
    origin: 'https://bubbio-2qce6.ondigitalocean.app',
    methods: ['GET', 'POST'],
  },
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
