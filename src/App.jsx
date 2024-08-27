import React, { useState } from "react";
import "./App.css";
import Scramble from "./components/Scramble/Scramble";
import Timer from "./components/Timer/Timer";

const App = () => {
  const [toScramble, setToScramble] = useState(false);

  const handleTimerStopped = () => {
    setToScramble((prev) => !prev);
  };

  return (
    <>
      <Scramble toScramble={toScramble} />
      <Timer onTimerStopped={handleTimerStopped} />
    </>
  );
};

export default App;
