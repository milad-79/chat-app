import React, { useMemo } from "react";
import { getUserColor } from "../helper/getColor";

function NameAvatar({ name }) {
  const initials = useMemo(() => {
    return name
      .split(" ")
      .map((n) => n[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);

  const bgColor = useMemo(() => getUserColor(name), [name]);
  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: bgColor }}
      >
        {initials}
      </div>
    </>
  );
}

export default React.memo(NameAvatar);
