const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store board state
let boardState = [];

// Serve static files
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing board state to new user
  socket.emit('boardState', boardState);

  // Listen for drawing actions
  socket.on('draw', (data) => {
    boardState.push(data);
    socket.broadcast.emit('draw', data);
  });

  // Listen for clear board action
  socket.on('clearBoard', () => {
    boardState = [];
    io.emit('clearBoard');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});