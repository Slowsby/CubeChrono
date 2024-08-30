import React, { useEffect, useState } from "react";
import Scramble from "./components/Scramble/Scramble";
import Timer from "./components/Timer/Timer";
import Average from "./components/Average/Average";
import "./App.css";

const App = () => {
  const [toScramble, setToScramble] = useState(false);
  // On Timer stopped, saves Time, Scramble and adds it as an object in the solveHistory array with addToHistory().
  const [solveTime, setSolveTime] = useState(0);
  const [solveScramble, setSolveScramble] = useState("");
  const [solveHistory, setSolveHistory] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [solveTimeOnLoad, setSolveTimeOnLoad] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("solveHistory");
    const storedTheme = localStorage.getItem("darkTheme");
    const storedSolveTimeOnLoad = localStorage.getItem("lastSolveTime");

    if (storedHistory) {
      setSolveHistory(JSON.parse(storedHistory));
    }

    if (storedTheme) {
      setDarkTheme(JSON.parse(storedTheme));
    }
    if (storedSolveTimeOnLoad) {
      setSolveTimeOnLoad(JSON.parse(storedSolveTimeOnLoad));
    }
  }, []);

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
      localStorage.setItem("lastSolveTime", JSON.stringify(solveTime));
    }
  }, [solveTime, solveScramble]);

  // Register data to localStorage && changes theme
  useEffect(() => {
    localStorage.setItem("solveHistory", JSON.stringify(solveHistory));
  }, [solveHistory]);
  useEffect(() => {
    document.body.className = darkTheme ? "dark" : "";
    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));
  }, [darkTheme]);

  return (
    <>
      <Scramble
        toScramble={toScramble}
        onScrambleGenerated={setSolveScramble}
        changeTheme={() => setDarkTheme((prev) => !prev)}
        darkTheme={darkTheme}
      />
      <Timer
        onTimerStopped={handleTimerStopped}
        solveTimeOnLoad={solveTimeOnLoad}
      />
      <Average solveHistory={solveHistory} darkTheme={darkTheme} />
    </>
  );
};

export default App;
