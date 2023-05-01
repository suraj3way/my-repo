// In the main file of your Node.js application
const io_client = require('socket.io-client');

const socket_client = io_client('ws://5.22.221.190:8000', {
  transports: ['websocket'],
  extraHeaders: {
    Referer: 'http://localhost:8000'
  }
});

socket_client.once('connect', () => {
  console.log('Socket client connected!');
});

socket_client.once('connect_error', (error) => {
  console.error('Socket client connection error:', error);
});

module.exports = socket_client;
