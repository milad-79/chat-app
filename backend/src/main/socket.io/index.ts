import { Server } from 'socket.io';
import { NamespaceSocketHandler } from './namespace.soket';

export const socketHandler = (io: Server) => {
  new NamespaceSocketHandler(io).initConnection();
  new NamespaceSocketHandler(io).createNamespacesConnection();
};
