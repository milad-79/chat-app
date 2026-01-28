import { useSelector } from "react-redux";
import ChatWindow from "./rigthSide/chatWindow";
import RightSideHeader from "./rigthSide/header";
import InputChat from "./rigthSide/inputChat";
import React, { useEffect, useState } from "react";
import api from "../../config/axios.config";

function RightSideChat({ user }) {
  const [messages, setMessages] = useState([]);
  const roomId = useSelector((state) => state.room.selectedRoom.id);

  useEffect(() => {
    api
      .post(
        `/message/get-messages`,
        { id: roomId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => setMessages(res.data));
  }, [roomId]);

  return (
    <>
      {/* Right side */}
      <div className="w-full border flex flex-col">
        {/* Header */}
        <RightSideHeader />

        {/* Messages */}
        <ChatWindow messages={messages} />

        {/* Input */}
        <InputChat userId={user.id} setMessages={setMessages} />
      </div>
    </>
  );
}

export default React.memo(RightSideChat);
