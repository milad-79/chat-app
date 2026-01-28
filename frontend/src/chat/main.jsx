import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import LeftSideChat from "./components/leftSide";
import RightSideChat from "./components/rightSide";
import ProfileComponent from "./components/profile/main";
import NoChatSelected from "./components/noSelectedChat";
import RoomsPanel from "./components/components/roomManegnet";

import { loadUserFromToken } from "../redux/slice/user";
import { fetchUserProfile } from "../redux/slice/personal";
import ConversitionMangment from "./components/components/conversitionMangment";
import api from "../config/axios.config";

function ChatAppMain() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openRoom, setOpenRoom] = useState(false);
  const [openConv, setOpenConv] = useState(false);

  const [conversations, setConversations] = useState([]);
  const [rooms, setRooms] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.payload);
  const userProfile = useSelector((state) => state.user_profile.payload);
  const room = useSelector((state) => state.room);
  const selectedConversation = useSelector(
    (state) => state.conversation?.selectedConversation
  );

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserProfile(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    try {
      const fetchAllConv = async () => {
        const res = await api.get("/conv/get");
        setConversations(res.data);
      };

      fetchAllConv();
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchRooms = async () => {
      const res = await api.post(
        "/room/get-all",
        { id: selectedConversation.id },
        { headers: { "Content-Type": "application/json" } }
      );
      setRooms(res.data);
    };

    fetchRooms();
  }, [selectedConversation]);

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-gray-100">
      {/* LEFT SIDEBAR */}
      <LeftSideChat
        user_profile={userProfile}
        user={user}
        rooms={rooms}
        setRooms={setRooms}
        conversation={conversations}
        setConversations={setConversations}
        setProfile={setOpenProfile}
        setRoomOpen={setOpenRoom}
        setConv={setOpenConv}
      />

      {/* CHAT AREA */}
      <div className="flex-1 flex">
        {!room.selectedRoom ? (
          <NoChatSelected />
        ) : (
          <RightSideChat user={user} />
        )}
      </div>

      {/* PROFILE MODAL */}
      {openProfile && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <ProfileComponent
            user={user}
            setOpenProfile={setOpenProfile}
            profileInfo={userProfile}
          />
        </div>
      )}

      {/* ROOMS PANEL */}
      {openRoom && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <RoomsPanel setOpen={setOpenRoom} rooms={rooms} setRooms={setRooms} />
        </div>
      )}

      {/* CONVERSIOTION PANEL */}
      {openConv && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <ConversitionMangment
            setOpen={setOpenConv}
            conversations={conversations}
            setConversations={setConversations}
          />
        </div>
      )}
    </div>
  );
}

export default React.memo(ChatAppMain);
