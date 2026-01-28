import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import AvatarRoom from "../components/avatarRoom";
import { getNamespaceSocket } from "../helper/initNameSpace";

function RightSideHeader() {
  const room = useSelector((state) => state.room?.selectedRoom);
  const endpoint = useSelector(
    (state) => state.conversation.selectedConversation.endpoint
  );

  const roomName = room.name;

  const [countUserOnline, setCountUsersOnline] = useState(0);

  useEffect(() => {
    if (!endpoint || !roomName) return;
    const socket = getNamespaceSocket(endpoint);
    socket.emit("joinRoom", roomName);
    socket.on("countOfOnlineUsers", (count) => {
      setCountUsersOnline(count);
    });
    return () => {
      socket.off("countOfOnlineUsers");
      // socket.emit("leaveRoom", roomName); // optional
    };
  }, [endpoint, roomName]);

  return (
    <div className="h-[60px] px-3 bg-header flex flex-row justify-between items-center">
      <div className="flex items-center">
        <div>
          <AvatarRoom room={room} size={41} />
        </div>
        <div className="ml-3">
          <p className="text-white text-sm">{room.name}</p>
          <p className="text-xs text-white/80">
            Online:{" "}
            <span className="font-semibold text-xs text-white">
              {countUserOnline}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(RightSideHeader);
