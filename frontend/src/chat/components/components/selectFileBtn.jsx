import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { BsPaperclip } from "react-icons/bs";
import { AiFillFileImage, AiFillAudio } from "react-icons/ai";

export default function FileSelectButton({ setFile }) {
  const fileInputRef = useRef(null);
  const [fileType, setFileType] = useState(null); // 'image' | 'audio' | null

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFile(file);

    if (file) {
      if (file.type.startsWith("image/")) setFileType("image");
      else if (file.type.startsWith("audio/")) setFileType("audio");
      else setFileType("other");
    } else {
      setFileType(null);
    }
  };

  // Choose icon based on file type
  const renderIcon = () => {
    if (fileType === "image")
      return <AiFillFileImage size={20} className="text-white" />;
    if (fileType === "audio")
      return <AiFillAudio size={20} className="text-white" />;
    return <BsPaperclip size={20} className="text-white" />;
  };

  // WhatsApp-style colors
  const bgColor = "#22c55e"; // default button color

  return (
    <label className="cursor-pointer relative">
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleChange}
        accept=".png, .jpg, .jpeg, .mp3"
      />

      <motion.div
        whileHover={{ y: -2, scale: 1.1, backgroundColor: "#22c55e" }}
        whileTap={{ y: -3, scale: 1.15, backgroundColor: "#128C7E" }}
        style={{ backgroundColor: bgColor }}
        className="w-10 h-10 flex items-center justify-center rounded transition-colors duration-200"
      >
        {renderIcon()}
      </motion.div>
    </label>
  );
}
