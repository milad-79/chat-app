import React from "react";
import { useSelector } from "react-redux";

function Menu({
  dropdownRef,
  ProfileHandler,
  setRoomOpen,
  setConv,
  onSignOut,
}) {
  const selectedConv = useSelector(
    (state) => state.conversation?.selectedConversation
  );

  return (
    <div
      ref={dropdownRef}
      role="menu"
      aria-orientation="vertical"
      aria-label="User menu"
      className="absolute right-0 mt-2 w-48 origin-top-right rounded-[4px] bg-white p-1 shadow-lg z-50"
    >
      <button
        onClick={ProfileHandler}
        className="block w-full text-left px-4 py-2 text-sm hover:text-gray-700 focus:outline-none"
        role="menuitem"
      >
        Your profile
      </button>

      <button
        onClick={() => setRoomOpen(true)}
        className={`block w-full ${!selectedConv && "text-gray-300"} ${selectedConv && "hover:text-gray-700"} text-left px-4 py-2 text-sm  focus:outline-none`}
        disabled={!selectedConv && true}
        role="menuitem"
      >
        Rooms
      </button>

      <button
        onClick={() => setConv(true)}
        className="block w-full text-left px-4 py-2 text-sm hover:text-gray-700 focus:outline-none"
        role="menuitem"
      >
        Conversitions
      </button>

      <button
        onClick={onSignOut}
        className="block w-full text-left px-4 py-2 text-sm hover:text-gray-700 focus:outline-none"
        role="menuitem"
      >
        Sign out
      </button>
    </div>
  );
}

export default React.memo(Menu);
