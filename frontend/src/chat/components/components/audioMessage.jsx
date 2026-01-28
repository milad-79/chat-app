import React, { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayPulseButton } from "./audiobutton";

const baseUrl = "http://localhost:3000";

function AudioMessage({ info, isMine }) {
  const waveformRef = useRef(null);
  const wsRef = useRef(null);

  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [ready, setReady] = useState(false);

  const audioFile = info.files?.find((f) => f.type.startsWith("audio"));

  // Time formatter
  const formatTime = (seconds = 0) =>
    [seconds / 60, seconds % 60]
      .map((v) => `0${Math.floor(v)}`.slice(-2))
      .join(":");

  useEffect(() => {
    if (!audioFile || !waveformRef.current) return;

    // CLEAN UP PREVIOUS INSTANCE
    if (wsRef.current) {
      wsRef.current.destroy();
      wsRef.current = null;
    }

    // CREATE WAVESURFER
    wsRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#d9d9d9",
      progressColor: "rgb(34, 197, 94)",
      height: 32,
      barGap: 2,
      cursorColor: "transparent",
      normalize: true,
    });

    wsRef.current.load(baseUrl + audioFile.address);

    // READY
    wsRef.current.on("ready", () => {
      const dur = wsRef.current.getDuration();
      setDuration(formatTime(dur));
      setReady(true);
    });

    // PLAY
    wsRef.current.on("play", () => {
      setIsRunning(true);
    });

    // PAUSE (do NOT reset time)
    wsRef.current.on("pause", () => {
      setIsRunning(false);
    });

    // FINISH → reset
    wsRef.current.on("finish", () => {
      const dur = wsRef.current.getDuration();
      setIsRunning(false);
      setDuration(formatTime(dur));
      wsRef.current.seekTo(0);
    });

    // LIVE COUNTDOWN
    wsRef.current.on("audioprocess", () => {
      if (!wsRef.current.isPlaying()) return;

      const current = wsRef.current.getCurrentTime();
      const dur = wsRef.current.getDuration();
      setDuration(formatTime(Math.max(dur - current, 0)));
    });

    return () => {
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [audioFile?.address]);

  return (
    <div className={`flex mb-1 ${isMine ? "justify-end" : "items-start"}`}>
      <div className="flex flex-col gap-1">
        <div className="flex flex-col w-full max-w-[320px] bg-neutral-secondary-soft rounded-e-base rounded-es-base">
          <div className="flex items-center space-x-2">
            {/* Play button */}
            <PlayPulseButton
              isPlaying={isRunning}
              disabled={!ready}
              onClick={() => wsRef.current?.playPause()}
            />

            {/* Waveform + Timer */}
            <div className="flex flex-col mt-3">
              <div ref={waveformRef} className="w-[145px]" />
              <p className="text-[10px] text-gray-400 mt-[2px]">{duration}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioMessage;
