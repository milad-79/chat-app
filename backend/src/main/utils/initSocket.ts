import { Server } from 'socket.io';
import http from 'http';

export const initialSocket = (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
    maxHttpBufferSize: 1e8,
  });
  return io;
};
