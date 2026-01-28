import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { BsPaperclip } from "react-icons/bs";
import api from "../../../config/axios.config";
import { getNamespaceSocket } from "../helper/initNameSpace";
import TypingIndicator from "../components/typeing";
import SendButton from "../components/sendMessageBtn";
import FileSelectButton from "../components/selectFileBtn";

function InputChat({ userId, setMessages }) {
  const room = useSelector((state) => state.room.selectedRoom);
  const currentConv = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const user = useSelector((state) => state.user.payload);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeout = useRef(null);

  const seenMessages = useRef(new Set());

  // -------------------- Namespace connection --------------------
  useEffect(() => {
    if (!currentConv?.endpoint) return;

    const socket = getNamespaceSocket(currentConv.endpoint);
    socketRef.current = socket;

    const handleConfirm = (msg) => {
      if (seenMessages.current.has(msg.id)) return;
      seenMessages.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
    };

    const handleTypingUsers = ({ users }) => {
      setTypingUsers(users.filter((u) => u !== user.username));
    };

    socket.on("confirmMessage", handleConfirm);
    socket.on("typingUsers", handleTypingUsers);

    return () => {
      socket.off("confirmMessage", handleConfirm);
      socket.off("typingUsers", handleTypingUsers);
    };
  }, [currentConv?.endpoint]);

  // -------------------- Join room --------------------
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !room) return;

    socket.emit("joinRoom", {
      roomName: room.name,
      username: user.username,
    });
  }, [room]);

  // -------------------- Typing handler --------------------
  const handleTyping = (e) => {
    setMessage(e.target.value);

    const socket = socketRef.current;
    if (!socket || !room) return;

    socket.emit("typing", {
      endpoint: currentConv.endpoint,
      roomName: room.name,
      username: user.username,
    });

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", {
        endpoint: currentConv.endpoint,
        roomName: room.name,
        username: user.username,
      });
    }, 1200);
  };

  // -------------------- Send message --------------------
  const sendMessage = async () => {
    if (!message.trim() && !file) return;

    const socket = socketRef.current;
    if (!socket?.connected) return;

    const formData = new FormData();
    formData.append("text", message);
    formData.append("roomId", room.id);
    formData.append("userId", userId);
    if (file) formData.append("file", file);

    try {
      const res = await api.post("/message/send", formData);

      const payload = {
        ...res.data,
        endpoint: currentConv.endpoint,
        roomName: room.name,
      };

      socket.emit("newMessage", payload);

      socket.emit("stopTyping", {
        endpoint: currentConv.endpoint,
        roomName: room.name,
        username: user.username,
      });

      setMessage("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Send message error:", err);
    }
  };

  // -------------------- Render typing text --------------------

  return (
    <div className="sticky bottom-0 p-3 bg-white">
      <TypingIndicator users={typingUsers} />

      <div className="flex items-center gap-2">
        <input
          className="flex-1 h-10 px-3 bg-gray-100 rounded outline-none"
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />

        {/* <label className="cursor-pointer">
          <BsPaperclip size={20} />
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".png, .jpg, .jpeg, .mp3"
          />
        </label> */}
        <FileSelectButton setFile={setFile} />

        <SendButton sendMessage={sendMessage} disabled={!message.trim()} />
      </div>
    </div>
  );
}

export default React.memo(InputChat);
