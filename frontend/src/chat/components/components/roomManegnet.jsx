import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";

import api from "../../../config/axios.config";
import AvatarRoom from "./avatarRoom";
import { updateSelectedRoom } from "../../../redux/slice/room";

function RoomsPanel({ setOpen, rooms, setRooms }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const reduxRoom = useSelector((state) => state.room.selectedRoom);
  const [convId, setConvId] = useState(null);

  const dispatch = useDispatch();

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    if (reduxRoom?.convId) {
      setConvId(reduxRoom.convId);
    }
  }, [reduxRoom]);

  useEffect(() => {
    if (!convId) return;

    api
      .post("/room/get-all", { id: convId })
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, [convId]);

  useEffect(() => {
    if (!selectedRoom) return resetForm();

    setName(selectedRoom.name || "");
    setDescription(selectedRoom.description || "");
    setFile(null);
  }, [selectedRoom]);

  /* ------------------ HELPERS ------------------ */

  const resetForm = () => {
    setSelectedRoom(null);
    setName("");
    setDescription("");
    setFile(null);
  };

  const submit = async () => {
    if (!name.trim() || !convId) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("convId", convId);
    if (file) formData.append("file", file);

    try {
      let res;

      if (selectedRoom) {
        formData.append("id", selectedRoom.id);
        res = await api.put("/room/update", formData);

        setRooms((prev) =>
          prev.map((r) => (r.id === res.data.data.id ? res.data.data : r)),
        );

        dispatch(updateSelectedRoom(res.data.data));
      } else {
        res = await api.post("/room/create", formData);
        setRooms((prev) => [res.data.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      console.log("sss");
      console.error("Room submit failed", err);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="w-[450px] h-full bg-white flex flex-col shadow-xl">
      {/* HEADER */}
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {selectedRoom ? "Update Room" : "Create Room"}
        </h3>

        <button
          onClick={() => setOpen(false)}
          className="p-1 bg-green-500 text-white rounded"
        >
          <IoMdClose size={18} />
        </button>
      </div>

      {/* FORM */}
      <div className="p-3 border-b">
        <input
          className="w-full mb-2 px-3 py-2 border rounded text-sm"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-2 px-3 py-2 border rounded text-sm"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* FILE UPLOAD */}
        <div
          onClick={() => document.getElementById("fileInput").click()}
          className="border-dashed border-2 rounded p-3 cursor-pointer text-center text-sm text-gray-500"
        >
          {!file ? "Click to upload file" : file.name}
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".png, .jpg, .jpeg"
          />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={submit}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            {selectedRoom ? "Update" : "Create"}
          </button>

          {selectedRoom && (
            <button onClick={resetForm} className="border px-3 py-1 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ROOMS LIST (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 font-semibold">Rooms</div>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`px-4 py-3 flex gap-3 cursor-pointer
              ${selectedRoom?.id === room.id ? "bg-gray-100" : "hover:bg-gray-50"}
            `}
          >
            <AvatarRoom room={room} />
            <div>
              <p className="font-medium">{room.name}</p>
              <p className="text-xs text-gray-500">{room.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(RoomsPanel);
