import { motion, AnimatePresence } from "framer-motion";

export default function TypingIndicator({ users = [] }) {
  const text = getTypingText(users);

  return (
    <AnimatePresence>
      {users.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mb-1 text-sm text-gray-500 flex items-center gap-1"
        >
          <span>{text}</span>
          <Dots />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function getTypingText(users) {
  if (users.length === 1) {
    return `${users[0]} is typing`;
  }

  if (users.length === 2) {
    return `${users[0]} and ${users[1]} are typing`;
  }

  return `${users[0]}, ${users[1]} and others are typing`;
}

function Dots() {
  return (
    <span className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 bg-gray-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
