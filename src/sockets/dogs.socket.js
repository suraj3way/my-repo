
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

function joinRoom(data){
  var mcx_scripts = [data];
  var done_scripts = [];
  const socket_client = io_client('ws://5.22.221.190:8000', {
    transports: ['websocket'],extraHeaders: {
      Referer: 'http://localhost:8000'
    }
  });

  for (const script of mcx_scripts) {
    socket_client.emit('join', script);
  }

  socket_client.on('stock', async (data) => {
    console.log(data, 'bt met');
    io.emit('stock', data)
  });

  socket_client.on('error', (error) => {
    // Handle the error here
    console.error(error);
  });
}
// Listen events
const on = () => {
 
  socket.on('join', (data) => {
    // io.emit('dogs:pong', data);
    joinRoom(data)
  });
};

export { socket, io };
