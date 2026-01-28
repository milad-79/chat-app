// socket.manager.js
import { Manager } from "socket.io-client";

export const manager = new Manager("http://localhost:3000", {
  transports: ["websocket", "polling"],
});
