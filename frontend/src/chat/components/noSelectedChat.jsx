import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

function NoChatSelected() {
  return (
    <motion.div
      className="flex items-center w-full justify-center h-full bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col items-center text-center max-w-sm px-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Floating Icon */}
        <motion.div
          className="relative mb-6"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <MessageCircle className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.h2
          className="text-lg font-semibold text-gray-800"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Select a chat to start messaging
        </motion.h2>

        <motion.p
          className="text-sm text-gray-500 mt-2"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Choose a conversation from the list to see messages here.
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default React.memo(NoChatSelected);
