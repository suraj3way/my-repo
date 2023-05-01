// const io_client = require('socket.io-client');
import ioClient from 'socket.io-client';
// Vars
let socket = null;
let io = null;
let socketClient = null;
const connectSocketClient = (url) => {
  if (!socketClient) {
    socketClient = ioClient(url, {
      transports: ['websocket'],
      extraHeaders: {
        Referer: 'http://localhost:8000'
      }
    });

    socketClient.on('error', (error) => {
      console.error(error);
    });

    socketClient.on('stock', (data) => {
      console.log(data, 'bt met');
      io.emit('stock', data);
    });
  }
};

const onJoin = (data) => {
  connectSocketClient('ws://5.22.221.190:8000');
  connectSocketClient('ws://5.22.221.190:5000');

  socketClient.emit('join', data);
};
// Constructor
export default (_socket, _io) => {
  socket = _socket;
  io = _io;
  on();
};



// Listen events
const on = () => {
  console.log('a user connected');

  socket.on('join', onJoin);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
};

export { socket, io };
