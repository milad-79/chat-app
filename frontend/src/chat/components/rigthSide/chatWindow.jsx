import { useSelector } from "react-redux";
import MessageBubble from "../components/messageTypes";
import React, { useEffect, useRef } from "react";
import DateMessage from "../components/dateMessage";

function formatDate(dateStr) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

function ChatWindow({ messages = [] }) {
  const { id: userId } = useSelector((state) => state.user.payload);
  const selectedChat = useSelector((state) => state.room.selectedRoom);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    if (selectedChat) scrollToBottom();
  }, [selectedChat, messages]);

  return (
    <div className="flex-1 overflow-auto bg-[url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/12ee6265-e947-474a-a378-6d78ab0d1117/d8fr7iz-082cab4c-3f87-47e1-b2f0-efdb504372e5.jpg/v1/fill/w_1024,h_576,q_75,strp/super_hero_whatsapp_background_by_x_ama_d8fr7iz-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6Ii9mLzEyZWU2MjY1LWU5NDctNDc0YS1hMzc4LTZkNzhhYjBkMTExNy9kOGZyN2l6LTA4MmNhYjRjLTNmODctNDdlMS1iMmYwLWVmZGI1MDQzNzJlNS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.jN8jKcTXD3VhytkXV7sLVzJMVRsGOmLsJDN6Jw8i9Vs')]">
      <div className="py-2 px-3">
        <div className="flex justify-center mb-4">
          <div
            className="rounded py-2 px-4"
            style={{ backgroundColor: "#FCF4CB" }}
          >
            <p className="text-xs">
              Messages to this chat and calls are now secured with end-to-end
              encryption. Tap for more info.
            </p>
          </div>
        </div>

        {messages.map((item, index) => {
          console.log(item);
          
          const isMine = userId === item.userId;
          const currentDate = formatDate(item.createdAt);
          const prevDate =
            index > 0 ? formatDate(messages[index - 1].createdAt) : null;
          const showDate = currentDate !== prevDate;

          return (
            <React.Fragment key={item.id}>
              {showDate && <DateMessage currentDate={currentDate} />}
              <MessageBubble info={item} isMine={isMine} />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default React.memo(ChatWindow);
