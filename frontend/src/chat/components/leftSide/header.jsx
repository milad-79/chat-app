import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import AvatarComponent from "../components/avatarComponent";
import api from "../../../config/axios.config";
import { FaEllipsisVertical } from "react-icons/fa6";
import Menu from "../components/menu";
import { ErrorToast } from "../../../config/toast.config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function HeaderLeft({ setConv, setRoomOpen, setProfile }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();

  // Safe access to username
  const username = useSelector((state) => state.user?.payload?.username);

  useEffect(() => {
    if (!username) return;

    api
      .get(`/user/get-user/${username}`)
      .then((res) => setUser(res.data))
      .catch((err) => {
        if (err.name !== "CanceledError") {
          console.error("Failed to fetch user:", err);
        }
      });
  }, [username]);

  const ProfileHandler = () => {
    setProfile((prev) => !prev);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  function onSignOut() {
    api
      .post("/user/logout", { id: user.id })
      .then(() => {
        Cookies.remove("access_token");
        navigate("/login");
      })
      .catch((e) => {
        ErrorToast(e.message);
      });
    setOpen(false);
  }

  return (
    <div className="bg-header h-[60px] py-2 px-3 flex flex-row justify-between items-center">
      <div className="flex justify-center gap-4">
        <AvatarComponent user={user} />

        <div>
          <p className="text-white text-sm">{username || "Unknown"}</p>
          <span className="text-xs text-gray-200">Online</span>
        </div>
      </div>

      <div className="relative ml-3">
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative flex rounded-full focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <span className="sr-only">Open user menu</span>
          <FaEllipsisVertical className="w-5 h-5 text-gray-100" />
        </button>

        {/* Menu */}
        {open && (
          <Menu
            dropdownRef={dropdownRef}
            setConv={setConv}
            setRoomOpen={setRoomOpen}
            ProfileHandler={ProfileHandler}
            onSignOut={onSignOut}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(HeaderLeft);
