import { useDispatch, useSelector } from "react-redux";
import { setSelectedRoom } from "../../../redux/slice/room";
import AvatarRoom from "../components/avatarRoom";
import React from "react";

function Room({ rooms }) {
  const dispatch = useDispatch();
  const selectedRoom = useSelector((state) => state.room.selectedRoom);

  const sendRoomInfo = (room) => {
    dispatch(setSelectedRoom(room));
  };

  return (
    <div className="flex-1 mt-3 pb-2">
      <div className="w-full p-3 mt-1">
        <h5 className="text-base text-gray-800 font-semibold">Rooms</h5>
      </div>

      <div className="flex flex-col gap-2 px-2">
        {rooms.length > 0 &&
          rooms.map((item) => (
            <div
              key={item.id}
              onClick={() => sendRoomInfo(item)}
              className={`flex items-center h-[70px] cursor-pointer p-2 rounded-md
              ${
                selectedRoom?.id === item.id
                  ? "bg-gray-300"
                  : "hover:bg-gray-100"
              }
            `}
            >
              <AvatarRoom room={item} />

              <div className="ml-4 flex-1 py-1">
                <p className="text-gray-800 text-sm font-medium">{item.name}</p>
                <p className="text-gray-500 mt-1 text-xs">{item.description}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default React.memo(Room);
