import React, { useEffect, useState } from "react";
import Conversition from "./conversition";
import Room from "./room";
import api from "../../../config/axios.config";
import { useSelector } from "react-redux";

function Container({ rooms, setRooms, conversations }) {
  const selectedConvId = useSelector(
    (state) => state.conversation?.selectedConversation?.id
  );

  useEffect(() => {
    if (!conversations || conversations.length === 0) return;

    const fetchRooms = async () => {
      try {
        const id = selectedConvId || conversations[0].id;
        const res = await api.post(
          `/room/get-all`,
          { id },
          { headers: { "Content-Type": "application/json" } }
        );
        setRooms(res.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, [selectedConvId, conversations]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {/* Conversition */}
      <Conversition allConv={conversations} />

      <Room rooms={rooms} />
    </div>
  );
}

export default React.memo(Container);
