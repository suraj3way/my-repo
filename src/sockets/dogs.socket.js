const io_client = require('socket.io-client');

// Vars
let socket = null;
let io = null;

// Constructor
export default (_socket, _io) => {
  socket = _socket;
  io = _io;
  on();
};

function joinRoom(data) {
  var mcx_scripts = [data];
  var done_scripts = [];

  // for (const script of mcx_scripts) {
  //   socket_client.emit('join', script);
  // }

  // for (const script of mcx_scripts) {
  //   socket_client2.emit('join', script);
  // }
}
// Listen events
const on = () => {
  const socket_client = io_client('ws://5.22.221.190:8000', {
    transports: ['websocket'],
    extraHeaders: {
      Referer: 'http://localhost:8000'
    }
  });
  const socket_client2 = io_client('ws://5.22.221.190:5000', {
    transports: ['websocket'],
    extraHeaders: {
      Referer: 'http://localhost:8000'
    }
  });
  socket.on('join', (data) => {
    // io.emit('dogs:pong', data);
    // joinRoom(data)
    socket_client.emit('join', data);
   

    socket_client.on('error', (error) => {
      // Handle the error here
      console.error(error);
    });

    socket_client2.emit('join', data);

   
    socket_client2.on('error', (error) => {
      // Handle the error here
      console.error(error);
    });
  });
  socket_client.on('stock', async (data) => {
    console.log(data, 'bt met');
    io.emit('stock', data);
  });

  socket_client2.on('stock', async (data) => {
    console.log(data, 'bt met');
    io.emit('stock', data);
  });

};

export { socket, io };
