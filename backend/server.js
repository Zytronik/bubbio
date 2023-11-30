const express = require('express');
const https = require('https'); // Ändere http zu https
const fs = require('fs'); // Erforderlich, um HTTPS-Zertifikate zu laden
const socketIo = require('socket.io');

const app = express();

// Lade SSL-Zertifikate (ersetze 'path/to/your/cert.crt' und 'path/to/your/private-key.key')
const options = {
  key: fs.readFileSync('path/to/your/private-key.key'),
  cert: fs.readFileSync('path/to/your/cert.crt'),
};

const server = https.createServer(options, app); // Verwende https.createServer

const io = socketIo(server, {
  cors: {
    origin: "https://bubbio-2qce6.ondigitalocean.app",
    methods: ["GET", "POST"]
  }
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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
