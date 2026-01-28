import { motion } from "framer-motion";

export function PlayPulseButton({ isPlaying, onClick }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* WhatsApp-style subtle ripple */}
      {isPlaying && (
        <motion.span
          className="absolute inline-flex h-10 w-10 rounded-full bg-green-500"
          initial={{ scale: 1, opacity: 0.25 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      {/* Main button */}
      <button
        onClick={onClick}
        className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white active:scale-95 transition"
      >
        {isPlaying ? (
          // Pause icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 9v6m4-6v6"
            />
          </svg>
        ) : (
          // Play icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
