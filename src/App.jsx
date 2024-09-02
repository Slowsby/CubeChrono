import React, { useEffect, useState } from "react";
import Scramble from "./components/Scramble/Scramble";
import Timer from "./components/Timer/Timer";
import Average from "./components/Average/Average";
import History from "./components/History/History";
import "./App.css";
import { Col, Container, Row } from "react-bootstrap";

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
  const deleteFromHistory = (index) => {
    const newHistory = [
      ...solveHistory.slice(0, index),
      ...solveHistory.slice(index + 1),
    ];
    setSolveHistory(newHistory);
  };
  const addTwo = (index) => {
    if (solveHistory[index].penalty) {
      return;
    }
    const newHistory = [...solveHistory];
    newHistory[index] = {
      ...newHistory[index],
      time: newHistory[index].time + 2,
      penalty: true,
    };
    setSolveHistory(newHistory);
  };
  const addDnf = (index) => {
    const newHistory = [...solveHistory];
    newHistory[index] = {
      ...newHistory[index],
      dnf: true,
    };
    setSolveHistory(newHistory);
  };
  const deletePenalty = (index) => {
    const newHistory = [...solveHistory];
    newHistory[index] = {
      ...newHistory[index],
      time: newHistory[index].penalty
        ? newHistory[index].time - 2
        : newHistory[index].time,
      dnf: false,
      penalty: false,
    };
    setSolveHistory(newHistory);
  };
  const clearSolveHistory = () => {
    setSolveHistory([]);
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
      <Container fluid>
        <Row>
          <Col xxl={2} className='d-flex flex-column justify-content-center'>
            <History
              solveHistory={solveHistory}
              darkTheme={darkTheme}
              deleteFromHistory={deleteFromHistory}
              addTwo={addTwo}
              addDnf={addDnf}
              deletePenalty={deletePenalty}
              clearSolveHistory={clearSolveHistory}
            />
          </Col>
          <Col
            xxl={10}
            className='d-flex flex-column justify-content-center order-first order-xxl-0'
          >
            <Timer
              onTimerStopped={handleTimerStopped}
              solveTimeOnLoad={solveTimeOnLoad}
            />
            <Average solveHistory={solveHistory} darkTheme={darkTheme} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
