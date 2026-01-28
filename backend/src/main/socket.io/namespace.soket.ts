import { Server, Socket } from 'socket.io';
import prisma from '../../configs/prisma.config';
import Controller from '../../helper/controller';

const typingUsers = new Map<string, Set<string>>();

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
        select: {
          title: true,
          endpoint: true,
          rooms: true,
        },
        orderBy: {
          id: 'desc',
        },
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
      this.io.of(`/${namespace.endpoint}`).on('connection', async (socket) => {
        const conversation = await prisma.conversation.findFirst({
          where: { endpoint: namespace.endpoint },
          select: { endpoint: true, rooms: true },
        });

        if (!conversation) {
          socket.emit('roomList', []);
          return;
        }

        socket.emit('roomList', conversation.rooms);

        socket.on('joinRoom', async ({ roomName, username }) => {
          socket.data.username = username;

          // leave previous room
          const lastRoom = Array.from(socket.rooms)[1];
          if (lastRoom) {
            socket.leave(lastRoom);
            await this.getCountOfOnlineUsers(namespace.endpoint, lastRoom);
          }

          socket.join(roomName);
          await this.getCountOfOnlineUsers(namespace.endpoint, roomName);

          const roomInfo = conversation.rooms.find(
            (item) => item.name === roomName,
          );

          socket.emit('roomInfo', roomInfo);

          this.getNewMessage(socket);
          this.handleTyping(socket);

          socket.on('disconnect', async () => {
            this.cleanupTypingOnDisconnect(socket);
            await this.getCountOfOnlineUsers(namespace.endpoint, roomName);
          });
        });
      });
    }
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
  getNewMessage(socket: Socket) {
    socket.on('newMessage', async (data) => {
      const { roomName, endpoint } = data;
      this.io.of(`/${endpoint}`).in(roomName).emit('confirmMessage', data);
    });
  }

  // =======================
  // TYPING INDICATOR (MULTI USER)
  // =======================
  handleTyping(socket: Socket) {
    socket.on('typing', ({ endpoint, roomName, username }) => {
      const key = `${endpoint}:${roomName}`;

      if (!typingUsers.has(key)) {
        typingUsers.set(key, new Set());
      }

      typingUsers.get(key)!.add(username);

      socket.to(roomName).emit('typingUsers', {
        users: Array.from(typingUsers.get(key)!),
      });
    });

    socket.on('stopTyping', ({ endpoint, roomName, username }) => {
      const key = `${endpoint}:${roomName}`;

      if (typingUsers.has(key)) {
        typingUsers.get(key)!.delete(username);

        if (typingUsers.get(key)!.size === 0) {
          typingUsers.delete(key);
        }
      }

      socket.to(roomName).emit('typingUsers', {
        users: typingUsers.has(key) ? Array.from(typingUsers.get(key)!) : [],
      });
    });
  }

  // =======================
  // CLEANUP ON DISCONNECT
  // =======================
  cleanupTypingOnDisconnect(socket: Socket) {
    const username = socket.data.username;
    if (!username) return;

    typingUsers.forEach((users, key) => {
      if (users.delete(username)) {
        const [, roomName] = key.split(':');
        socket.to(roomName).emit('typingUsers', {
          users: Array.from(users),
        });
      }
    });
  }
}
