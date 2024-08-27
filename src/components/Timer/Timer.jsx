import React, { useEffect, useState, useRef } from "react";
import "./Timer.css";

const Timer = ({ onTimerStopped }) => {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [isRunning, setRunning] = useState(false);
  const [isSpaceHeld, setSpaceHeld] = useState(false);
  const [ignoreSpaceUp, setIgnoreSpaceUp] = useState(false);
  const [ignore, setIgnore] = useState(false);
  const [color, setColor] = useState("");

  const handleStart = () => {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    onTimerStopped();
  };

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  const spaceDown = ({ code }) => {
    if (code === "Space") {
      setSpaceHeld(true);
      if (isRunning) {
        setRunning(false);
        handleStop();
        setIgnoreSpaceUp(true);
        setIgnore(true);
        setTimeout(() => {
          setIgnoreSpaceUp(false);
          setIgnore(false);
        }, 1000);
      }
    }
  };

  const spaceUp = ({ code }) => {
    if (code === "Space") {
      setSpaceHeld(false);
      if (!isRunning && !ignoreSpaceUp) {
        setRunning(true);
        handleStart();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", spaceDown);
    window.addEventListener("keyup", spaceUp);
    return () => {
      window.removeEventListener("keydown", spaceDown);
      window.removeEventListener("keyup", spaceUp);
    };
  }, [ignoreSpaceUp, isRunning]);

  useEffect(() => {
    if (isSpaceHeld && !isRunning && !ignore) {
      setColor("red");
      setIgnoreSpaceUp(true);
      const timer = setTimeout(() => {
        setColor("green");
        setIgnoreSpaceUp(false);
      }, 350);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setColor("red");
    }
  }, [isSpaceHeld, isRunning, ignore]);

  return (
    <p className='timer' style={{ color: isSpaceHeld ? color : "" }}>
      {secondsPassed.toFixed(2)}
    </p>
  );
};

export default Timer;
