import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { defaultTimeFormat } from '../../utils/defaultTimeFormat';
import './Session.css';

const Session = ({
  darkTheme,
  solveHistory,
  exportSession,
  clearSolveHistory
}) => {
  const [session, setSession] = useState(['session1']);
  const [currentSession, setCurrentSession] = useState('session1');
  const [sessionName, setSessionName] = useState(['Session 1']);
  const [meanOfThree, setMeanOfThree] = useState(null);
  const [bestMeanOfThree, setBestMeanOfThree] = useState(null);

  const [averageOfFive, setAverageOfFive] = useState(null);
  const [bestOfFive, setBestOfFive] = useState(null);

  const [averageOfTwelve, setAverageOfTwelve] = useState(null);
  const [bestOfTwelve, setBestOfTwelve] = useState(null);

  const [averageOfTwentyFive, setAverageOfTwentyFive] = useState(null);
  const [bestOfTwentyFive, setBestOfTwentyFive] = useState(null);

  const [averageOfFifty, setAverageOfFifty] = useState(null);
  const [bestOfFifty, setBestOfFifty] = useState(null);

  const [averageOfHundred, setAverageOfHundred] = useState(null);
  const [bestOfHundred, setBestOfHundred] = useState(null);

  const [bestTime, setBestTime] = useState(null);
  const [worstTime, setWorstTime] = useState(null);

  const [meanTotal, setMeanTotal] = useState(null);

  useEffect(() => {
    const storedStates = JSON.parse(localStorage.getItem('states'));
    if (storedStates) {
      setSession(storedStates.sessionArr);
      setSessionName(storedStates.sessionNameArr);
      setCurrentSession(storedStates.currentSession);
    }
  }, []);

  useEffect(() => {
    const states = {
      sessionArr: session,
      sessionNameArr: sessionName,
      currentSession: currentSession
    };
    localStorage.setItem('states', JSON.stringify(states));
  }, [session, sessionName, currentSession]);
  useEffect(() => {
    const calculateAvg = (n) => {
      const sort = [...solveHistory]
        // Filter out DNF'd times
        .filter((el) => !el.dnf)
        .sort((a, b) => a.time - b.time);
      setBestTime(sort[0]?.time);
      setWorstTime(sort[sort.length - 1]?.time);
      // Calculate Mean of 3
      if (n === 3) {
        // Check if the length is the correct number, else return null
        if (solveHistory.length >= n) {
          const lastNSolves = solveHistory.slice(-n).reverse();
          const dnfNumber = lastNSolves.filter((el) => el.dnf === true);
          // If one time is "DNF", return "DNF"
          if (dnfNumber.length >= 1) {
            return 'DNF';
          } else {
            const average = (
              lastNSolves.reduce((acc, el) => acc + el.time, 0) / n
            ).toFixed(2);
            return average;
          }
        } else {
          return null;
        }
      }
      // Calculate all AVG in the Session component
      if (solveHistory.length >= n) {
        const lastNSolves = solveHistory.slice(-n).reverse();
        const sortedArray = lastNSolves.sort((a, b) => a.time - b.time);
        const dnfNumber = lastNSolves.filter((el) => el.dnf === true);
        // If two time are "DNF", return "DNF"
        if (dnfNumber.length >= 2) {
          return 'DNF';
        } else {
          const middleThree = sortedArray.slice(1, -1);
          const average = (
            middleThree.reduce((acc, el) => acc + el.time, 0) /
            (n - 2)
          ).toFixed(2);
          return average;
        }
      } else {
        return null;
      }
    };
    // Calculate total session mean time, if any time is DNF, just exclude it.
    const calculateTotalMean = () => {
      const filteredArray = [...solveHistory].filter((el) => !el.dnf);
      const mean =
        filteredArray.reduce((acc, el) => acc + el.time, 0) /
        filteredArray.length;
      return mean;
    };

    setMeanTotal(calculateTotalMean());
    setMeanOfThree(calculateAvg(3));
    setAverageOfFive(calculateAvg(5));
    setAverageOfTwelve(calculateAvg(12));
    setAverageOfTwentyFive(calculateAvg(25));
    setAverageOfFifty(calculateAvg(50));
    setAverageOfHundred(calculateAvg(100));
  }, [solveHistory]);

  // Sort through history for best
  useEffect(() => {
    const calculateBestAvg = (n) => {
      if (n === 3) {
        let bestAverage = Infinity;
        for (let i = 0; i <= solveHistory.length - n; i++) {
          const window = solveHistory.slice(i, i + n);
          window.sort((a, b) => a.time - b.time);
          const average = window.reduce((acc, el) => acc + el.time, 0) / n;
          if (average < bestAverage) {
            bestAverage = average;
          }
        }
        return bestAverage;
      }
      let bestAverage = Infinity;

      // If n = 5
      // first window = [0-4], calculates avg  and compares
      // next window = [1-5], calculates avg and compares
      for (let i = 0; i <= solveHistory.length - n; i++) {
        const window = solveHistory.slice(i, i + n);
        window.sort((a, b) => a.time - b.time);
        // As in Average.jsx, cubing avg is calculated without the slowest and fastest time, so we slice them out
        const trimmedWindow = window.slice(1, -1);
        const average =
          trimmedWindow.reduce((acc, el) => acc + el.time, 0) / (n - 2);
        // If the calcuated average is smaller than the last, replace it.
        if (average < bestAverage) {
          bestAverage = average;
        }
      }
      return bestAverage;
    };
    setBestMeanOfThree(calculateBestAvg(3));
    setBestOfFive(calculateBestAvg(5));
    setBestOfTwelve(calculateBestAvg(12));
    setBestOfTwentyFive(calculateBestAvg(25));
    setBestOfFifty(calculateBestAvg(50));
    setBestOfHundred(calculateBestAvg(100));
  }, [solveHistory]);

  useEffect(() => {
    exportSession(currentSession);
  }, [currentSession]);

  const handleSessionChange = (event) => {
    // If selected the "Edit Session" option
    if (event.target.value === 'editSession') {
      // Exctract answer to window.prompt with a 20 char limit
      let answer = window
        .prompt(
          `[ ${sessionName[session.findIndex((el) => el === currentSession)]} ] \nRename or type 'delete' to delete the session\n`,
          sessionName[session.findIndex((el) => el === currentSession)]
        )
        .slice(0, 20);
      // If empty or cancelled, return.
      if (answer === '' || answer === null) {
        return;
      }
      // Delete option
      if (answer === 'delete') {
        if (session.length === 1) {
          return;
        }
        //Find the current session index
        const toRemove = session.findIndex((el) => el === currentSession);

        const updatedSessions = [...session];
        const updatedSessionNames = [...sessionName];
        // Remove the current session
        updatedSessions.splice(toRemove, 1);
        // Remove the current session's name
        updatedSessionNames.splice(toRemove, 1);

        // Clear solveHistory from all solves with the session ID
        clearSolveHistory(session[toRemove]);
        // Update the session and sessionName array with the deleted session
        setSession(updatedSessions);
        setSessionName(updatedSessionNames);
        // Select the first option after deleting
        setCurrentSession(updatedSessions[0]);
      } else {
        // if not empty and not "delete", rename session
        // Find index of the current session
        const toRename = session.findIndex((el) => el === currentSession);
        const updatedSessionNames = [...sessionName];
        // Set the current session name with the prompt answer
        updatedSessionNames[toRename] = answer;
        // Update sessionName array
        setSessionName(updatedSessionNames);
      }
      // If selected the "New Session" option
    } else if (event.target.value === 'newSession') {
      // create new session
      // Generate a unique ID for the session ID
      const newSession = uuidv4();
      // Add the new session ID to the session array
      setSession((prevSession) => [...prevSession, newSession]);
      // Add a name to the new session
      setSessionName((prevSession) => [
        ...prevSession,
        `Session ` + (prevSession.length + 1)
      ]);
      //
      setCurrentSession(newSession);
    } else {
      setCurrentSession(event.target.value);
    }
  };
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col
          className={
            darkTheme ? 'col-auto sessionColDark' : 'col-auto sessionCol'
          }
          onTouchEnd={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <form
            className='sessionHeader'
            onTouchEnd={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <select
              className={`${darkTheme ? 'dark' : ''} sessionSelect`}
              value={currentSession}
              onChange={handleSessionChange}
            >
              {session.map((el, index) => {
                return (
                  <option key={index} value={el}>
                    {sessionName[index]}
                  </option>
                );
              })}
              <option className='extOpt' value='editSession'>
                Edit Session
              </option>
              <option className='extOpt' value='newSession'>
                New Session
              </option>
            </select>
          </form>
          <div>
            <h5>
              {/*Show the total amount of valid solves / All solves */}
              Solve {solveHistory.filter((el) => !el.dnf).length}/
              {solveHistory.length}
            </h5>
            <h6>Mean : {meanTotal ? defaultTimeFormat(meanTotal) : ''}</h6>
          </div>
          <div className='sessionBandWTime d-flex justify-content-between'>
            <div>
              <h6>Best time</h6>
              <hr />
              <p
                className='sessionTime'
                id={
                  bestTime ? '' : darkTheme ? 'placeholderDark' : 'placeholder'
                }
              >
                {bestTime ? defaultTimeFormat(bestTime) : 'N/A'}
              </p>
            </div>
            <div>
              <h6>Worst Time</h6>
              <hr />
              <p
                className='sessionTime'
                id={
                  bestTime ? '' : darkTheme ? 'placeholderDark' : 'placeholder'
                }
              >
                {worstTime ? defaultTimeFormat(worstTime) : 'N/A'}
              </p>
            </div>
          </div>
          <hr />
          <div>
            <div>
              <div className='sessionAvgTitle d-flex justify-content-between'>
                <p>Average</p>
                <p>Current</p>
                <p>Best</p>
              </div>
              {solveHistory.length >= 3 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Mean of 3:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(meanOfThree)}
                  </p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(bestMeanOfThree)}
                  </p>
                </div>
              )}
              {solveHistory.length >= 5 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 5:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(averageOfFive)}
                  </p>
                  <p className='sessionAvgTime'>
                    {bestOfFive ? defaultTimeFormat(bestOfFive) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 12 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 12:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(averageOfTwelve)}
                  </p>
                  <p className='sessionAvgTime'>
                    {bestOfTwelve ? defaultTimeFormat(bestOfTwelve) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 25 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 25:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(averageOfTwentyFive)}
                  </p>
                  <p className='sessionAvgTime'>
                    {bestOfTwentyFive
                      ? defaultTimeFormat(bestOfTwentyFive)
                      : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 50 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 50:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(averageOfFifty)}
                  </p>
                  <p className='sessionAvgTime'>
                    {bestOfFifty ? defaultTimeFormat(bestOfFifty) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 100 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 100:</p>
                  <p className='sessionAvgTime'>
                    {defaultTimeFormat(averageOfHundred)}
                  </p>
                  <p className='sessionAvgTime'>
                    {bestOfHundred ? defaultTimeFormat(bestOfHundred) : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Session;
