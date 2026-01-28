import { manager } from "../../../config/socket.config";

const namespaceSockets = new Map();

export function getNamespaceSocket(endpoint) {
  if (!endpoint) return null;

  if (!namespaceSockets.has(endpoint)) {
    const socket = manager.socket(`/${endpoint}`, {
      autoConnect: true,
    });

    namespaceSockets.set(endpoint, socket);
  }

  return namespaceSockets.get(endpoint);
}
