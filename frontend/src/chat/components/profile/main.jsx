import React, { useState, useEffect } from "react";
import api from "../../../config/axios.config";
import { ErrorToast, SuccessToast } from "../../../config/toast.config";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../../redux/slice/personal";

function ProfileComponent({ user, setOpenProfile, profileInfo }) {
  const base = "http://localhost:3000";

  const dispatch = useDispatch();

  // Initialize states
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [name, setName] = useState(profileInfo?.fullName || "");

  useEffect(() => {
    setImgUrl(
      profileInfo?.imageUrl
        ? base + profileInfo.imageUrl
        : "https://www.transparentpng.com/download/user/gray-user-profileInfo-icon-png-fP8Q1P.png",
    );
    setName(profileInfo?.fullName || "");
  }, [profileInfo]);

  // Handle file selection and preview
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImgUrl(URL.createObjectURL(selectedFile));
    }
  };

  // Handle name input change
  const onChangeName = (e) => {
    setName(e.target.value);
  };

  // Close profileInfo panel
  const onClose = () => {
    setOpenProfile((prev) => !prev);
  };

  // Send user info to server
  const sendInfo = async () => {
    const formData = new FormData();
    formData.append("full_name", name || user.userDetails?.full_name);
    formData.append("userID", user.id);
    if (file) formData.append("file", file);

    try {
      let res;
      if (profileInfo) {
        res = await api.put("/user-detaile/update", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        dispatch(updateProfile(res.data)); // update redux
      } else {
        res = await api.post("/user-detaile/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      SuccessToast(res.data.message);
      onClose();
    } catch (err) {
      ErrorToast("Failed to update profile.");
    }
  };

  const lastSeenDate = profileInfo
    ? new Date(profileInfo.updatedAt)
        .toLocaleDateString("en-CA")
        .replace(/-/g, "/")
    : null;

  const lastSeen = `Last seen ${lastSeenDate}`;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 flex flex-col z-50">
      <button
        className="self-end mb-4 text-gray-700 text-xl font-bold hover:text-gray-500"
        onClick={onClose}
      >
        ✕
      </button>

      <div className="flex flex-col items-center">
        <img
          src={imgUrl}
          alt={user.username}
          className="w-24 h-24 rounded-full border-[2px] border-green-800 bg-white object-cover mb-4"
        />

        <div className="flex flex-col mb-2 items-start space-y-2">
          <label
            htmlFor="fileUpload"
            className="inline-block cursor-pointer bg-green-500 text-white px-4 py-2 rounded-[4px] hover:bg-green-600"
          >
            Choose File
          </label>

          <input
            id="fileUpload"
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <h2 className="text-xl font-bold">{name || "Choose"}</h2>
        <p className="text-xs mt-1 text-gray-500">
          {lastSeenDate ? lastSeen : "Create Profile"}
        </p>
      </div>

      <div className="mt-6">
        <label className="block mb-1 text-[15px] text-gray-600">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          className="w-full mb-3 border rounded-md px-3 py-2 focus:outline-none focus:ring-1 border-gray-300 focus:ring-green-500"
          onChange={onChangeName}
        />

        <button
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          onClick={sendInfo}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default React.memo(ProfileComponent);
