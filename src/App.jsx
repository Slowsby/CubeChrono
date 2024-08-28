import React, { useEffect, useState } from "react";
import "./App.css";
import Scramble from "./components/Scramble/Scramble";
import Timer from "./components/Timer/Timer";
import Average from "./components/History/Average";

const App = () => {
  const [toScramble, setToScramble] = useState(false);
  // On Timer stopped, saves Time, Scramble and adds it as an object in the solveHistory array with addToHistory().
  const [solveTime, setSolveTime] = useState(0);
  const [solveScramble, setSolveScramble] = useState("");
  const [solveHistory, setSolveHistory] = useState([]);

  const handleTimerStopped = (solvingTime) => {
    setSolveTime(solvingTime);
    setToScramble((prev) => !prev);
  };

  const addToHistory = (solveTime, solveScramble) => {
    const newSolve = {
      time: solveTime,
      scramble: solveScramble,
    };
    setSolveHistory((prevSolve) => [...prevSolve, newSolve]);
  };

  useEffect(() => {
    if (solveTime && solveScramble) {
      addToHistory(Number(solveTime), solveScramble);
      setSolveTime(0);
      setSolveScramble("");
    }
  }, [solveTime, solveScramble]);

  return (
    <>
      <Scramble
        toScramble={toScramble}
        onScrambleGenerated={setSolveScramble}
      />
      <Timer onTimerStopped={handleTimerStopped} />
      <Average solveHistory={solveHistory} />
    </>
  );
};

export default App;
