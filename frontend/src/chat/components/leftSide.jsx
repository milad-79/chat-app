import React from "react";
import Container from "./leftSide/container";
import HeaderLeft from "./leftSide/header";

function LeftSideChat({
  user_profile,
  user,
  rooms,
  setRooms,
  conversation,
  setConversations,
  setConv,
  setRoomOpen,
  setProfile,
}) {
  const { profile_image_url } = user_profile || {};
  const { username } = user || {};

  return (
    <>
      {/* Left */}
      <div className="w-[430px] h-full flex flex-col border-r">
        {/* Header */}
        <HeaderLeft
          imageUrl={profile_image_url}
          username={username}
          user={user}
          setConv={setConv}
          setProfile={setProfile}
          setRoomOpen={setRoomOpen}
        />

        <Container
          rooms={rooms}
          setRooms={setRooms}
          conversations={conversation}
          setConversations={setConversations}
        />
      </div>
    </>
  );
}

export default React.memo(LeftSideChat);
