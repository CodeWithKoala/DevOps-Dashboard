const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);  // Create HTTP server
const io = new Server(server);  // Initialize Socket.io with the server

app.use(cors());
app.use(express.json());

// Handle initial HTTP request
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A client connected');

  // Send CPU and memory usage every 5 seconds
  const interval = setInterval(() => {
    const cpuUsage = Math.random() * 100;
    const memoryUsage = Math.random() * 16;
    
    // Emit 'systemData' event with CPU and memory data
    socket.emit('systemData', {
      cpuUsage: cpuUsage.toFixed(2),
      memoryUsage: memoryUsage.toFixed(2),
      uptime: process.uptime(),
    });
  }, 5000);

  // Cleanup when client disconnects
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
