import { Server, Socket } from 'socket.io';
import prisma from '../../configs/prisma.config';
import Controller from '../../helper/controller';

const typingUsers = new Map<string, Set<string>>(); // key: `${endpoint}:${roomName}`

export class NamespaceSocketHandler extends Controller {
  private io: Server;

  constructor(io: Server) {
    super();
    this.io = io;
  }

  // =======================
  // MAIN CONNECTION
  // =======================
  initConnection() {
    this.io.on('connection', async (socket) => {
      const namespaces = await prisma.conversation.findMany({
        select: { title: true, endpoint: true, rooms: true },
        orderBy: { id: 'desc' },
      });

      socket.emit('namespacesList', namespaces);
    });
  }

  // =======================
  // NAMESPACE CONNECTIONS
  // =======================
  async createNamespacesConnection() {
    const namespaces = await prisma.conversation.findMany({
      select: { endpoint: true, rooms: true, title: true },
      orderBy: { id: 'desc' },
    });

    for (const namespace of namespaces) {
      const nsp = this.io.of(`/${namespace.endpoint}`);

      nsp.on('connection', async (socket) => {
        const conversation = await prisma.conversation.findFirst({
          where: { endpoint: namespace.endpoint },
          select: { endpoint: true, rooms: true },
        });

        if (!conversation) {
          socket.emit('roomList', []);
          return;
        }

        socket.emit('roomList', conversation.rooms);

        // =======================
        // JOIN ROOM
        // =======================
        socket.on('joinRoom', async ({ roomName, username }) => {
          socket.data.username = username;

          // Leave all previous rooms
          const oldRooms = Array.from(socket.rooms).filter(
            (r) => r !== socket.id,
          );
          for (const r of oldRooms) {
            await this.removeUserFromRoom(socket, namespace.endpoint, r);
          }

          // Join new room
          socket.join(roomName);
          socket.data.currentRoom = roomName;

          await this.getCountOfOnlineUsers(namespace.endpoint, roomName);

          const roomInfo = conversation.rooms.find((r) => r.name === roomName);
          socket.emit('roomInfo', roomInfo);

          this.getNewMessage(socket, namespace.endpoint);
          this.handleTyping(socket, namespace.endpoint);
        });

        // =======================
        // LEAVE ROOM (fully remove user from room & typing)
        // =======================
        socket.on('leaveRoom', async ({ roomName }) => {
          if (!roomName) return;
          await this.removeUserFromRoom(socket, namespace.endpoint, roomName);
        });

        // =======================
        // DISCONNECT (remove user from all rooms in this namespace)
        // =======================
        socket.on('disconnect', async () => {
          const username = socket.data.username;
          if (!username) return;

          const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
          for (const r of rooms) {
            await this.removeUserFromRoom(socket, namespace.endpoint, r);
          }
        });
      });
    }
  }

  // =======================
  // REMOVE USER FROM ROOM & CLEANUP
  // =======================
  private async removeUserFromRoom(
    socket: Socket,
    endpoint: string,
    roomName: string,
  ) {
    const username = socket.data.username;
    if (!username) return;

    socket.leave(roomName);

    // Remove typing
    const key = `${endpoint}:${roomName}`;
    if (typingUsers.has(key)) {
      typingUsers.get(key)!.delete(username);
      if (typingUsers.get(key)!.size === 0) typingUsers.delete(key);
      socket.to(roomName).emit('typingUsers', {
        users: typingUsers.has(key) ? Array.from(typingUsers.get(key)!) : [],
      });
    }

    // Update online users count
    await this.getCountOfOnlineUsers(endpoint, roomName);
  }

  // =======================
  // ONLINE USERS COUNT
  // =======================
  async getCountOfOnlineUsers(endpoint: string, roomName: string) {
    const namespace = this.io.of(`/${endpoint}`);
    const sockets = await namespace.in(roomName).allSockets();
    namespace.in(roomName).emit('countOfOnlineUsers', sockets.size);
  }

  // =======================
  // MESSAGES
  // =======================
  getNewMessage(socket: Socket, endpoint: string) {
    socket.on('newMessage', (data) => {
      const roomName = socket.data.currentRoom;
      if (!roomName) return;
      this.io.of(`/${endpoint}`).in(roomName).emit('confirmMessage', data);
    });
  }

  // =======================
  // TYPING INDICATOR
  // =======================
  handleTyping(socket: Socket, endpoint: string) {
    socket.on('typing', ({ roomName, username }) => {
      const key = `${endpoint}:${roomName}`;
      if (!typingUsers.has(key)) typingUsers.set(key, new Set());
      typingUsers.get(key)!.add(username);

      socket.to(roomName).emit('typingUsers', {
        users: Array.from(typingUsers.get(key)!),
      });
    });

    socket.on('stopTyping', ({ roomName, username }) => {
      const key = `${endpoint}:${roomName}`;
      if (typingUsers.has(key)) {
        typingUsers.get(key)!.delete(username);
        if (typingUsers.get(key)!.size === 0) typingUsers.delete(key);
      }

      socket.to(roomName).emit('typingUsers', {
        users: typingUsers.has(key) ? Array.from(typingUsers.get(key)!) : [],
      });
    });
  }
}
