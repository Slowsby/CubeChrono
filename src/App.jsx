import React, { useEffect, useState } from 'react';
import Scramble from './components/Scramble/Scramble';
import Timer from './components/Timer/Timer';
import Average from './components/Average/Average';
import History from './components/History/History';
import Session from './components/Session/Session';
import { scrambleToTwisty } from './utils/scrambleChoiceToTwisty';
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';

const App = () => {
  const [toScramble, setToScramble] = useState(false);
  const [scrambleChoice, setScrambleChoice] = useState('333');
  const [isRunning, setIsRunning] = useState('false');
  // On Timer stopped, saves Time, Scramble and adds it as an object in the solveHistory array with addToHistory().
  const [solveTime, setSolveTime] = useState(0);
  const [solveScramble, setSolveScramble] = useState('');
  const [solveHistory, setSolveHistory] = useState([]);
  const [darkTheme, setDarkTheme] = useState(false);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isInspectionActive, setIsInspectionActive] = useState(false);
  const [isDrawScrambleActive, setIsDrawScrambleActive] = useState(false);
  const [session, setSession] = useState('session1');
  const [currentSessionHistory, setCurrentSessionHistory] = useState([]);
  const [lastInspectionPenalty, setLastInspectionPenalty] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('solveHistory');
    const storedTheme = localStorage.getItem('darkTheme');
    const storedSettings = localStorage.getItem('settings');
    const parsedSettings = JSON.parse(storedSettings);
    if (storedHistory) {
      setSolveHistory(JSON.parse(storedHistory));
    }

    if (storedTheme) {
      setDarkTheme(JSON.parse(storedTheme));
    }
    if (parsedSettings) {
      setIsFocusModeActive(parsedSettings.focus);
      setIsInspectionActive(parsedSettings.inspection);
    }
    setIsDrawScrambleActive(false);
  }, []);

  const handleTimerStopped = (solvingTime, penalty) => {
    setLastInspectionPenalty(penalty);
    setSolveTime(solvingTime);
    setToScramble((prev) => !prev);
  };

  const addToHistory = (solveTime, solveScramble, session) => {
    if (lastInspectionPenalty == '+2') {
      const newSolve = {
        time: solveTime + 2,
        scramble: solveScramble,
        session: session, // session allows to filter the array for the current session
        date: Date.now(), // sets date of the solve in ms, also used as a unique ID to manipulate the array in the children components
        penalty: true,
        puzzle: scrambleChoice
      };
      setSolveHistory((prevSolve) => [...prevSolve, newSolve]);
      return;
    } else if (lastInspectionPenalty == 'DNF') {
      const newSolve = {
        time: solveTime,
        scramble: solveScramble,
        session: session, // session allows to filter the array for the current session
        date: Date.now(), // sets date of the solve in ms, also used as a unique ID to manipulate the array in the children components
        dnf: true,
        puzzle: scrambleChoice
      };
      setSolveHistory((prevSolve) => [...prevSolve, newSolve]);
      return;
    }
    const newSolve = {
      time: solveTime,
      scramble: solveScramble,
      session: session, // session allows to filter the array for the current session
      date: Date.now(), // sets date of the solve in ms, also used as a unique ID to manipulate the array in the children components
      puzzle: scrambleChoice
    };
    setSolveHistory((prevSolve) => [...prevSolve, newSolve]);
  };

  // Next 4 functions use date as a unique ID to identify the correct element to delete.
  const deleteFromHistory = (date) => {
    const index = solveHistory.findIndex((el) => el.date === date);
    const newHistory = [
      ...solveHistory.slice(0, index),
      ...solveHistory.slice(index + 1)
    ];
    setSolveHistory(newHistory);
  };
  const addTwo = (date) => {
    const index = solveHistory.findIndex((el) => el.date === date);
    if (solveHistory[index].penalty) {
      return;
    }
    const newHistory = [...solveHistory];
    newHistory[index] = {
      ...newHistory[index],
      time: newHistory[index].time + 2,
      penalty: true
    };
    setSolveHistory(newHistory);
  };
  const addDnf = (date) => {
    const newHistory = [...solveHistory];
    const index = newHistory.findIndex((el) => el.date === date);
    newHistory[index] = {
      ...newHistory[index],
      dnf: true
    };
    setSolveHistory(newHistory);
  };
  const deletePenalty = (date) => {
    const newHistory = [...solveHistory];
    const index = newHistory.findIndex((el) => el.date === date);
    newHistory[index] = {
      ...newHistory[index],
      time: newHistory[index].penalty
        ? newHistory[index].time - 2
        : newHistory[index].time,
      dnf: false,
      penalty: false
    };
    setSolveHistory(newHistory);
  };
  const clearSolveHistory = (sessionName) => {
    const updatedSolveHistory = solveHistory.filter(
      (solve) => solve.session !== sessionName
    );
    setSolveHistory(updatedSolveHistory);
  };
  const deleteAll = () => {
    setSolveHistory([]);
    localStorage.removeItem('solveHistory');
    localStorage.removeItem('states');
  };

  // Set currentSession that will be used by currentSessionHistory
  const exportSession = (currentSession) => {
    setSession(currentSession);
  };

  const exportScrambleChoice = (scramble) => {
    setScrambleChoice(scramble);
  };

  const handleRunning = (bool) => {
    setIsRunning(bool);
  };
  useEffect(() => {
    if (solveTime && solveScramble) {
      addToHistory(Number(solveTime), solveScramble, session);
      setSolveTime(0);
      setSolveScramble('');
    }
  }, [solveTime, solveScramble]);

  // Register data to localStorage && changes theme
  useEffect(() => {
    localStorage.setItem('solveHistory', JSON.stringify(solveHistory));
  }, [solveHistory]);
  useEffect(() => {
    document.body.className = darkTheme ? 'dark' : '';
    localStorage.setItem('darkTheme', JSON.stringify(darkTheme));
  }, [darkTheme]);

  // Filtered out array gets sent out to child components based on current session
  useEffect(() => {
    const sessionHistory = solveHistory.filter((el) => el.session === session);
    setCurrentSessionHistory(sessionHistory);
  }, [session, solveHistory]);

  return (
    <>
      <Scramble
        toScramble={toScramble}
        exportScrambleChoice={exportScrambleChoice}
        importScrambleChoice={scrambleChoice}
        onScrambleGenerated={setSolveScramble}
        changeTheme={() => setDarkTheme((prev) => !prev)}
        darkTheme={darkTheme}
        focus={() => setIsFocusModeActive((prev) => !prev)}
        updateFocus={isFocusModeActive}
        updateInspection={() => setIsInspectionActive((prev) => !prev)}
        updateDrawScramble={() => setIsDrawScrambleActive((prev) => !prev)}
        isRunning={isRunning}
      />
      <Container fluid>
        <Row>
          <Col
            xxl={2}
            className={`d-flex flex-column justify-content-center ${isFocusModeActive ? 'focusHidden' : ''}`}
          >
            <History
              solveHistory={currentSessionHistory}
              darkTheme={darkTheme}
              deleteFromHistory={deleteFromHistory}
              addTwo={addTwo}
              addDnf={addDnf}
              deletePenalty={deletePenalty}
              clearSolveHistory={clearSolveHistory}
            />
          </Col>
          <Col
            xxl={8}
            className={`d-flex flex-column justify-content-center order-first order-xxl-0 ${isFocusModeActive ? (isRunning ? 'focusHidden' : 'show') : 'show'}`}
          >
            <Timer
              onTimerStopped={handleTimerStopped}
              darkTheme={darkTheme}
              solveHistory={currentSessionHistory}
              exportRunning={handleRunning}
              isInspectionActive={isInspectionActive}
            />
            <Average
              solveHistory={currentSessionHistory}
              darkTheme={darkTheme}
            />
          </Col>{' '}
          <Col
            xxl={2}
            className={`d-flex flex-column justify-content-center ${isFocusModeActive ? 'focusHidden' : ''}`}
          >
            <Session
              darkTheme={darkTheme}
              importScrambleChoice={scrambleChoice}
              exportScrambleChoice={exportScrambleChoice}
              solveHistory={currentSessionHistory}
              exportSession={exportSession}
              clearSolveHistory={clearSolveHistory}
              deleteAll={deleteAll}
            />
          </Col>
        </Row>
        {isDrawScrambleActive ? (
          <twisty-player
            class={
              isDrawScrambleActive && isRunning && isFocusModeActive
                ? 'focusHidden'
                : 'show'
            }
            experimental-setup-alg={solveScramble}
            experimental-setup-anchor='end'
            puzzle={scrambleToTwisty(scrambleChoice)}
            visualization='2D'
            background='none'
            back-view='none'
            control-panel='none'
            style={{ width: '20vw', height: '30vh' }}
          />
        ) : null}
      </Container>
    </>
  );
};

export default App;
