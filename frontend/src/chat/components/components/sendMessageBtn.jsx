import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiSendPlaneFill } from "react-icons/ri";

export default function SendButton({ sendMessage, disabled }) {
  const [isSending, setIsSending] = useState(false);

  const handleClick = () => {
    if (disabled || isSending) return;

    setIsSending(true);
    sendMessage?.();

    // Reset after animation (icon disappears)
    setTimeout(() => setIsSending(false), 700);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative w-10 h-10 flex items-center justify-center bg-green-500 text-white rounded cursor-pointer disabled:opacity-50 overflow-hidden"
    >
      {/* Static icon when not sending */}
      {!isSending && (
        <motion.div
          whileHover={{ y: -2, scale: 1.1 }}
          whileTap={{ y: -3, scale: 1.15 }}
          className="relative z-10"
        >
          <RiSendPlaneFill size={20} />
        </motion.div>
      )}

      {/* Flying icon animation */}
      <AnimatePresence>
        {isSending && (
          <motion.div
            key="send-animation"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: [0, 20, 40, 60], // moves right
              y: [0, -10, -25, -50], // moves up (curved path)
              rotate: [0, 15, 25, 45], // rotation for plane effect
              opacity: [1, 1, 0.8, 0], // fades out
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute top-0 left-0 z-10"
          >
            <RiSendPlaneFill size={20} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
