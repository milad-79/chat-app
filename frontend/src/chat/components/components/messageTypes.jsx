import React from "react";
import AudioMessage from "./audioMessage";
import ImageCompenent from "./imageMessage";
import AvatarMessage from "./avatarMessage";
import { getUserColor } from "../helper/getColor";
import { BsCheckLg, BsCheckAll } from "react-icons/bs";

function formatTime(timestamp) {
  return new Date(timestamp)
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
}

function MessageBubble({ info, isMine }) {
  const time = formatTime(info.createdAt);
  const bgColor = isMine ? "#E2F7CB" : "#F2F2F2";
  const imageFile = info.files?.find((f) => f.type?.startsWith("image"));
  const username = info.user?.username || "Unknown";

  console.log(info);
  

  return (
    <div
      className={`flex mb-2 gap-1 ${isMine ? "justify-end" : "items-start"}`}
    >
      {!isMine && <AvatarMessage info={info} />}

      <div
        className={`flex flex-col rounded-md py-2 px-3 ${!isMine ? "ml-2" : ""}`}
        style={{ backgroundColor: bgColor }}
      >
        {!isMine && (
          <p
            className="text-sm font-bold"
            style={{ color: getUserColor(username) }}
          >
            {username}
          </p>
        )}

        {/* TEXT MESSAGE */}
        {info.text && <p className="text-sm mt-1 text-gray-800">{info.text}</p>}

        {/* IMAGE MESSAGE */}
        {imageFile && (
          <ImageCompenent
            address={"http://localhost:3000" + imageFile.address}
          />
        )}

        {/* AUDIO MESSAGE */}
        {info.files?.some((f) => f.type?.startsWith("audio")) && (
          <AudioMessage isMine={isMine} info={info} />
        )}

        <div className="flex items-center gap-2 mt-1">
          <p className="text-right text-[10px] text-gray-500">{time}</p>
          {isMine &&
            (info.status ? (
              <BsCheckAll className="text-blue-500" size={18} />
            ) : (
              <BsCheckLg className="text-gray-400" />
            ))}
        </div>
      </div>
    </div>
  );
}

export default React.memo(MessageBubble);
