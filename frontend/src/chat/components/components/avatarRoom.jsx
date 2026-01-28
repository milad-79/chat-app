import React from "react";
import NameAvatar from "./nameAvatar";

const AvatarRoom = ({ room, size = 48 }) => {
  const name = room.name;
  const url = "http://localhost:3000" + room.imageUrl;

  return (
    <div
      style={{ height: `${size}px`, width: `${size}px` }}
      className="rounded-full overflow-hidden flex items-center justify-center"
    >
      {room?.imageUrl ? (
        <img
          src={url.toString()}
          alt={name}
          className="w-full h-full bg-white object-cover"
        />
      ) : (
        <NameAvatar name={name} />
      )}
    </div>
  );
};

export default React.memo(AvatarRoom);
