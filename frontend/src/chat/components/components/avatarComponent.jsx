import React from "react";
import { useSelector } from "react-redux";
import NameAvatar from "./nameAvatar";

function AvatarComponent({ user, size = 46 }) {
  const name = user?.username ?? "User";

  const imageProfile = useSelector(
    (state) => state.user_profile.payload?.imageUrl
  );

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
          className="w-full h-full object-cover bg-white p-1"
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

export default React.memo(AvatarComponent);
