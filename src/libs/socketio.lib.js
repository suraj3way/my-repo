import redisAdapter from 'socket.io-redis';
// Constants
import {
  SERVER_WEBSOCKET_PORT,
  REDIS_HOSTNAME,
  REDIS_PORT,
  REDIS_PASSWORD
} from '@/constants/config.constant';
// Business
// import UserBusiness from '@/business/users.business';
// Utils
import autoload from '@/utils/autoload.util';
import { mws } from '@/utils/middleware.util';
// const io_client = require('socket.io-client');

const io = require('socket.io')(SERVER_WEBSOCKET_PORT);
const PORT = require('net').isIP(REDIS_HOSTNAME) ? `:${REDIS_PORT}` : '';

// import socketManager from '../sockets/socket_client';

io.adapter(
  redisAdapter(
    REDIS_PASSWORD
      ? `redis://:${REDIS_PASSWORD}@${REDIS_HOSTNAME}${PORT}/1`
      : `redis://${REDIS_HOSTNAME}${PORT}/1`
  )
);
// io.eio.pingTimeout = 120000; // 2 minutes
// io.eio.pingInterval = 5000; // 5 seconds

const connect = () =>
  new Promise((resolve) => {
    console.log(`✅ Socket: initiated!`);
    // connection
    io.on('connection', (socket) => {
      console.log(`❕Socket: client connected! (${socket.id})`);

      // disconnect
      socket.on('disconnect', (reason) => {
        console.log(`❕Socket: client disconnected! (${socket.id}) ${reason}`);
        // UserBusiness.removeSocket(socket);
      });
      // socket.set("pingTimeout", 63000);
      // autoload
      autoload.sockets(socket, io);
      resolve();
    });

    // middleware
    io.use(async (socket, next) => {
      socket.onAny(async (event) => {
        console.log(`Socket: event: ${event} (${socket.id})`);
      });

      const _next = await mws(socket, next);
      // UserBusiness.setSocket(socket);
      return _next;
    });

 

 
  });

  // const socket_client = io_client('ws://5.22.221.190:8000', {
  //   transports: ['websocket'],
  //   extraHeaders: {
  //     Referer: 'http://localhost:8000'
  //   }
  // });
  // socket_client.once('connect', () => {
  //   console.log('Socket client connected!');
  //   socket_client.emit('join', "CRUDEOIL_19MAY2023");
  //   socket_client.on('stock', async (sc_data) => {
  //     console.log(sc_data, 'bt met');
  //     io.emit(sc_data.name, sc_data);
  //     io.to(sc_data.name).emit(sc_data.name, sc_data);
  //   });
  // });
  
  // socket_client.once('connect_error', (error) => {
  //   console.error('Socket client connection error:', error);
  // });
// const client_connections = () => socket_client;
const connections = () => io.engine.clientsCount;
// socketManager(io);

export { connect, connections };
