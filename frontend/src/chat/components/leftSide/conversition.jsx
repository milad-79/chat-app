import React from "react";
import AvatarConv from "./conversitionAvatar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedConversation } from "../../../redux/slice/conversition";

function Conversition({ allConv }) {
  const dispatch = useDispatch();

  const currentConvers = useSelector(
    (state) => state.conversation.selectedConversation
  );

  const setCurrentConvFunc = (conv) => {
    dispatch(setSelectedConversation(conv));
  };

  return (
    <>
      <div className="flex-1 overflow-auto mt-3 border-b border-gray-100 pb-2">
        <div className="w-full p-3 mt-1">
          <h5 className="text-base text-gray-800">Conversitions</h5>
        </div>
        {/* Example Contact */}
        <div className="gap-1 p-2">
          {allConv &&
            allConv.map((item) => {
              return (
                <div
                  id={item.id}
                  onClick={() => {
                    setCurrentConvFunc(item);
                  }}
                  endpoint={item.endpoint}
                  className={`px-3 h-[70px] flex items-center bg-grey-light cursor-pointer p-2 rounded-md  ${
                    currentConvers?.id === item.id ? "bg-gray-300" : ""
                  }`}
                >
                  <div>
                    <AvatarConv conv={item} />
                  </div>

                  <div className="ml-4 flex-1 py-4">
                    <div className="flex flex-col">
                      <p className="text-grey-darkest text-sm">{item.title}</p>
                      <p className="text-gray-500 text-[11px] mt-[2px]">
                        {`${item._count.rooms} Room`}
                        {item._count.rooms == 0 ? "" : `s`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default React.memo(Conversition);
