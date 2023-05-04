// import ioClient from 'socket.io-client';

// let socketClient = null;
// let io = null;

// const connectSocketClient = (url) => {
//   if (!socketClient) {
//     socketClient = ioClient(url, {
//       transports: ['websocket'],
//       extraHeaders: {
//         Referer: 'http://localhost:8000'
//       }
//     });

//     socketClient.on('error', (error) => {
//       console.error(error);
//     });

//     socketClient.on('stock', (data) => {
//       console.log(data, 'bt met');
//       io.emit('stock', data);
//     });
//   }
// };

// const onJoin = (data) => {
//   connectSocketClient('ws://5.22.221.190:8000');
//   connectSocketClient('ws://5.22.221.190:5000');

//   socketClient.emit('join', data);
// };

// export default (_io) => {
//   io = _io;
//   io.on('connection', (socket) => {
//     socket.on('join', onJoin);
//   });
// };
