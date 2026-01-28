import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";

import AvatarConversation from "../leftSide/conversitionAvatar"; // create similar to AvatarRoom
import api from "../../../config/axios.config";

function ConversationsPanel({ setOpen, conversations, setConversations }) {
  const [selectedConv, setSelectedConv] = useState(null);

  const [name, setName] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (!selectedConv) return resetForm();
    setName(selectedConv.title || "");
    setEndpoint(selectedConv.endpoint || "");
    setFile(null);
  }, [selectedConv]);

  /* ------------------ HELPERS ------------------ */

  const resetForm = () => {
    setSelectedConv(null);
    setName("");
    setEndpoint("");
    setFile(null);
  };

  const submit = async () => {
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("title", name);
    formData.append("endpoint", endpoint);
    if (file) formData.append("file", file);

    try {
      let res;

      if (selectedConv) {
        formData.append("id", selectedConv.id);

        res = await api.put("/conv/update", formData);

        setConversations((prev) =>
          prev.map((c) => (c.id === res.data.data.id ? res.data.data : c))
        );
      } else {
        res = await api.post("/conv/create", formData);
        console.log(res.data);

        setConversations((prev) => [res.data.data, ...prev]);
      }

      resetForm();
    } catch (err) {
      console.error("Conversation submit failed", err);
    }
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="w-[420px] h-full bg-white flex flex-col shadow-xl">
      {/* HEADER */}
      <div className="p-3 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {selectedConv ? "Update Conversation" : "Create Conversation"}
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
          placeholder="Conversation name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-2 px-3 py-2 border rounded text-sm"
          placeholder="Endpoint name"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
        />

        {/* IMAGE UPLOAD */}
        <div
          onClick={() => document.getElementById("convFile").click()}
          className="border-dashed border-2 rounded p-3 cursor-pointer text-center text-sm text-gray-500"
        >
          {!file ? "Click to upload image" : file.name}
          <input
            id="convFile"
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
            {selectedConv ? "Update" : "Create"}
          </button>

          {selectedConv && (
            <button onClick={resetForm} className="border px-3 py-1 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* CONVERSATIONS LIST (ONLY THIS SCROLLS) */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 font-semibold">Conversations</div>

        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => setSelectedConv(conv)}
            className={`px-4 py-3 flex gap-3 cursor-pointer
              ${
                selectedConv?.id === conv.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }
            `}
          >
            <AvatarConversation conv={conv} />
            <div className="flex items-center">
              <p className="font-medium text-[15px] text-gray-800">
                {conv.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ConversationsPanel);
