import React from "react";

function DateMessages({ currentDate }) {
  return (
    <>
      <div className="flex justify-center mb-2">
        <div
          className="rounded-sm py-2 px-4"
          style={{ backgroundColor: "#fff5ee" }}
        >
          <p className="text-sm text-gray-800 uppercase">{currentDate}</p>
        </div>
      </div>
    </>
  );
}

export default React.memo(DateMessages);
