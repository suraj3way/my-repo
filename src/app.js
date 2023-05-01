// base
import { create as express } from '@/libs/express.lib';
import { connect as mongoose } from '@/libs/mongoose.lib';
import { connect as redis } from '@/libs/redis.lib';
import { connect as ws } from '@/libs/socketio.lib';
import autoload from '@/utils/autoload.util';
const io_client = require('socket.io-client');

/**
 * init
 */
const init = async () => {
  // Connect to DB (You can enable seeds)
  await db();
  // Connect to Redis
  await redis();
  // Add cronjobs
  await cronjobs();
  // Create Express app and add routes
  await routes();
  // Connect Sockets (idle to connections...)

  sockets();
};

/**
 * db
 */
const db = async () => {
  await mongoose();
  // Load Models
  await autoload.models();
  // Load Seeds
  await autoload.seeds();
};

/**
 * cronjobs
 */
const cronjobs = async () => {
  // Load cronjobs
  await autoload.cronjobs();
};

/**
 * routes
 */
const routes = async () => {
  // Load routes
  await express(await autoload.routes());
};

/**
 * sockets
 */
const sockets = async () => {
  await ws();
};

const sockets_client = async () => {
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
};



export { init, sockets_client };
