import React from "react";
import NameAvatar from "./nameAvatar";

function AvatarMessageComponent({ info, size = 46 }) {
  const name = info?.user.username ?? "User";

  const imageProfile = info?.user?.details?.imageUrl || null;    

  const avatarSrc = imageProfile
    ? `http://localhost:3000${imageProfile}`
    : null;

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden flex items-center justify-center"
    >
      {imageProfile ? (
        <img
          src={avatarSrc}
          alt={name}
          className="w-full h-full object-cover bg-white"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = placeholder;
          }}
        />
      ) : (
        <NameAvatar name={name} />
      )}
    </div>
  );
}

export default React.memo(AvatarMessageComponent);
