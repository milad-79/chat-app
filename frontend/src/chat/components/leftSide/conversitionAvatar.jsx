import React from "react";
import { getUserColor } from "../helper/getColor";
import NameAvatar from "../components/nameAvatar";

const AvatarConv = ({ conv, size = 48 }) => {
  // ⏳ async-safe guard
  if (!conv) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-200 animate-pulse"
      />
    );
  }

  const name = conv.title || "";
  const imageUrl = conv.imageUrl
    ? `http://localhost:3000${conv.imageUrl}`
    : null;

  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-full overflow-hidden flex items-center justify-center shrink-0"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "";
          }}
        />
      ) : (
        <NameAvatar name={name} />
      )}
    </div>
  );
};

export default React.memo(AvatarConv);
