import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import { defaultTimeFormat } from '../../utils/defaultTimeFormat';
import { SessionModal } from './sessionModals';
import './Session.css';

//
// NEEDS refactoring
//

const Session = ({
  darkTheme,
  importScrambleChoice,
  exportSession,
  solveHistory,
  exportScrambleChoice,
  clearSolveHistory,
  deleteAll
}) => {
  const [session, setSession] = useState([
    { id: 'session1', name: 'Session 1', lastChoice: '333' }
  ]);
  const [currentSession, setCurrentSession] = useState('session1');
  const [meanOfThree, setMeanOfThree] = useState({});
  const [bestMeanOfThree, setBestMeanOfThree] = useState({});

  const [averageOfFive, setAverageOfFive] = useState({});
  const [bestOfFive, setBestOfFive] = useState({});

  const [averageOfTwelve, setAverageOfTwelve] = useState({});
  const [bestOfTwelve, setBestOfTwelve] = useState({});

  const [averageOfTwentyFive, setAverageOfTwentyFive] = useState({});
  const [bestOfTwentyFive, setBestOfTwentyFive] = useState({});

  const [averageOfFifty, setAverageOfFifty] = useState({});
  const [bestOfFifty, setBestOfFifty] = useState({});

  const [averageOfHundred, setAverageOfHundred] = useState({});
  const [bestOfHundred, setBestOfHundred] = useState({});

  const [bestTime, setBestTime] = useState([]);
  const [showBestTime, setShowBestTime] = useState(false);
  const [worstTime, setWorstTime] = useState([]);
  const [showWorstTime, setShowWorstTime] = useState(false);
  const [meanTotal, setMeanTotal] = useState(null);

  const [solveShow, setSolveShow] = useState(false);
  // Modal props
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState(false);
  const [n, setN] = useState(3);
  const [data, setData] = useState([]);

  const handleModal = (arr) => {
    setShow(true);
    setData(arr);
  };

  useEffect(() => {
    const storedStates = JSON.parse(localStorage.getItem('states'));
    if (storedStates) {
      setSession(storedStates.sessionArr);
      setCurrentSession(storedStates.currentSession);
    }
  }, []);

  useEffect(() => {
    const toFind = session.findIndex((obj) => obj.id === currentSession);
    session[toFind].lastChoice = importScrambleChoice;
  });
  useEffect(() => {
    const states = {
      sessionArr: session,
      currentSession: currentSession
    };
    localStorage.setItem('states', JSON.stringify(states));
  }, [session, currentSession]);
  useEffect(() => {
    const calculateAvg = (n) => {
      const sort = [...solveHistory]
        // Filter out DNF'd times
        .filter((el) => !el.dnf)
        .sort((a, b) => a.time - b.time);
      setBestTime(sort[0]);
      setWorstTime(sort[sort.length - 1]);
      // Calculate Mean of 3
      if (n === 3) {
        // Check if the length is the correct number, else return null
        if (solveHistory.length >= n) {
          const lastNSolves = solveHistory.slice(-n).reverse();
          const dnfNumber = [...lastNSolves].filter((el) => el.dnf === true);
          // If one time is "DNF", return "DNF"
          if (dnfNumber.length >= 1) {
            return { output: 'DNF', arr: lastNSolves };
          } else {
            const average = (
              lastNSolves.reduce((acc, el) => acc + el.time, 0) / n
            ).toFixed(2);
            return { output: average, arr: lastNSolves };
          }
        } else {
          return null;
        }
      }
      // Calculate all AVG in the Session component
      if (solveHistory.length >= n) {
        const lastNSolves = solveHistory.slice(-n).reverse();
        const sortedArray = [...lastNSolves].sort((a, b) => a.time - b.time);
        const dnfNumber = [...lastNSolves].filter((el) => el.dnf === true);
        // If two time are "DNF", return "DNF"
        if (dnfNumber.length >= 2) {
          return { output: 'DNF', arr: lastNSolves };
        } else {
          const middleThree = sortedArray.slice(1, -1);
          const average = (
            middleThree.reduce((acc, el) => acc + el.time, 0) /
            (n - 2)
          ).toFixed(2);
          return { output: average, arr: lastNSolves };
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
        let bestArr = [];
        for (let i = 0; i <= solveHistory.length - n; i++) {
          const window = solveHistory.slice(i, i + n);
          const sortedWindow = [...window].sort((a, b) => a.time - b.time);
          const average =
            sortedWindow.reduce((acc, el) => acc + el.time, 0) / n;
          if (average < bestAverage) {
            bestAverage = average;
            bestArr = window;
          }
        }
        return { output: bestAverage, arr: bestArr };
      }
      let bestAverage = Infinity;
      let bestArr = [];

      // If n = 5
      // first window = [0-4], calculates avg  and compares
      // next window = [1-5], calculates avg and compares
      for (let i = 0; i <= solveHistory.length - n; i++) {
        const window = solveHistory.slice(i, i + n);
        const sortedWindow = [...window].sort((a, b) => a.time - b.time);
        // As in Average.jsx, cubing avg is calculated without the slowest and fastest time, so we slice them out
        const trimmedWindow = sortedWindow.slice(1, -1);
        const average =
          trimmedWindow.reduce((acc, el) => acc + el.time, 0) / (n - 2);
        // If the calcuated average is smaller than the last, replace it.
        if (average < bestAverage) {
          bestAverage = average;
          bestArr = window;
        }
      }
      return { output: bestAverage, arr: bestArr };
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
          `[ ${session[session.findIndex((obj) => obj.id === currentSession)].name} ] \n----\nRename or type 'delete' to delete the session\n----\n`,
          session[session.findIndex((obj) => obj.id === currentSession)].name
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
        const toRemove = session.findIndex((obj) => obj.id === currentSession);

        const updatedSessions = [...session];
        // Remove the current session
        updatedSessions.splice(toRemove, 1);

        // Clear solveHistory from all solves with the session ID
        clearSolveHistory(session[toRemove]);
        // Update the session and sessionName array with the deleted session
        setSession(updatedSessions);
        // Select the first option after deleting
        setCurrentSession(updatedSessions[0].id);
        exportScrambleChoice(
          session[session.findIndex((obj) => obj.id === event.target.value)]
            .lastChoice
        );
      } else {
        // if not empty and not "delete", rename session
        // Find index of the current session
        const toRename = session.findIndex((obj) => obj.id === currentSession);
        const updatedSessionNames = [...session];
        // Set the current session name with the prompt answer
        updatedSessionNames[toRename].name = answer;
        setSession(updatedSessionNames);
      }
      // If selected the "New Session" option
    } else if (event.target.value === 'newSession') {
      // create new session
      const newSession = {
        id: uuidv4(),
        name: `Session ${session.length + 1}`
      };
      setSession((prevSession) => [...prevSession, newSession]);
      setCurrentSession(newSession.id);
      exportScrambleChoice(
        session[session.findIndex((obj) => obj.id === event.target.value)]
          .lastChoice
      );
    } else if (event.target.value === 'deleteAll') {
      let answer = window.prompt(
        `!! WARNING !!\n----\nTHIS WILL DELETE YOUR ENTIRE HISTORY ACROSS EVERY SESSIONS\n----\nType 'Yes' to confirm.\n----\n`
      );
      if (answer.toLowerCase() === 'yes') {
        deleteAll();
        setSession([{ id: 'session1', name: 'Session 1', lastChoice: '333' }]);
        setCurrentSession('session1');
      } else {
        setCurrentSession(session[0].id);
      }
    } else {
      setCurrentSession(event.target.value);
      exportScrambleChoice(
        session[session.findIndex((obj) => obj.id === event.target.value)]
          .lastChoice
      );
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
                  <option key={index} value={el.id}>
                    {session[index].name}
                  </option>
                );
              })}
              <option className='extOpt' value='editSession'>
                Edit Session
              </option>
              <option className='extOpt' value='newSession'>
                New Session
              </option>
              <option className='extOpt warn' value='deleteAll'>
                Delete All
              </option>
            </select>
          </form>
          <div>
            <a
              onClick={() => {
                if (solveHistory[0]) {
                  setSolveShow(solveHistory);
                }
              }}
              id={darkTheme ? 'dark' : ''}
              className='sessionAvgTime'
            >
              <h5>
                {/*Show the total amount of valid solves / All solves */}
                Solve {solveHistory.filter((el) => !el.dnf).length}/
                {solveHistory.length}
              </h5>
            </a>
            <Modal
              show={solveShow}
              onHide={() => setSolveShow(false)}
              dialogClassName='customModal'
              aria-labelledby='customModal'
            >
              <Modal.Header className='modalHeader' closeButton>
                <Modal.Title id='customModal'>
                  Solves {solveHistory.filter((el) => !el.dnf).length}/
                  {solveHistory.length}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className='modalBody'>
                <p>
                  <textarea
                    rows={20}
                    className='inputScramble textarea'
                    value={solveHistory
                      .map(
                        (el, index) =>
                          `- ${index + 1}: ${el.dnf ? `DNF(${defaultTimeFormat(el.time)})` : el.penalty ? `(${defaultTimeFormat(el.time)})+2` : defaultTimeFormat(el.time)}, ${el.scramble}`
                      )

                      .join('\n')}
                    readOnly
                  ></textarea>
                </p>
              </Modal.Body>
            </Modal>

            <h6>Mean : {meanTotal ? defaultTimeFormat(meanTotal) : ''}</h6>
          </div>
          <div className='sessionBandWTime d-flex justify-content-between'>
            <div>
              <h6>Best time</h6>
              <hr />
              <a
                className='sessionTime'
                id={
                  bestTime?.time
                    ? darkTheme
                      ? 'dark'
                      : ''
                    : darkTheme
                      ? 'placeholderDark'
                      : 'placeholder'
                }
                onClick={() => {
                  if (bestTime.time) {
                    setShowBestTime(true);
                  }
                }}
              >
                {bestTime?.time ? defaultTimeFormat(bestTime.time) : 'N/A'}
              </a>
              <Modal show={showBestTime} onHide={() => setShowBestTime(false)}>
                <Modal.Header className='modalHeader' closeButton>
                  <Modal.Title>Best Time</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                  <p>
                    Date
                    <br />
                    <input
                      className='inputScramble'
                      value={new Date(bestTime?.date).toLocaleString()}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Time <br />
                    <input
                      className='inputTime'
                      value={defaultTimeFormat(bestTime?.time)}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Scramble
                    <br />
                    <input
                      className='inputScramble'
                      value={bestTime?.scramble}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Plain text
                    <textarea
                      className='inputScramble noresize'
                      value={`B: ${defaultTimeFormat(bestTime?.time)}, ${bestTime?.scramble}`}
                      readOnly
                    ></textarea>
                  </p>
                </Modal.Body>
              </Modal>
            </div>
            <div>
              <h6>Worst Time</h6>
              <hr />
              <a
                className='sessionTime'
                id={
                  bestTime?.time
                    ? darkTheme
                      ? 'dark'
                      : ''
                    : darkTheme
                      ? 'placeholderDark'
                      : 'placeholder'
                }
                onClick={() => {
                  if (worstTime.time) {
                    setShowWorstTime(true);
                  }
                }}
              >
                {worstTime?.time ? defaultTimeFormat(worstTime.time) : 'N/A'}
              </a>
              <Modal
                show={showWorstTime}
                onHide={() => setShowWorstTime(false)}
              >
                <Modal.Header className='modalHeader' closeButton>
                  <Modal.Title>Worst Time</Modal.Title>
                </Modal.Header>
                <Modal.Body className='modalBody'>
                  <p>
                    Date
                    <br />
                    <input
                      className='inputScramble'
                      value={new Date(worstTime?.date).toLocaleString()}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Time <br />
                    <input
                      className='inputTime'
                      value={defaultTimeFormat(worstTime?.time)}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Scramble
                    <br />
                    <input
                      className='inputScramble'
                      value={worstTime?.scramble}
                      readOnly
                    ></input>
                  </p>
                  <p>
                    Plain text
                    <textarea
                      className='inputScramble noresize'
                      value={`W: ${defaultTimeFormat(worstTime?.time)}, ${worstTime?.scramble}`}
                      readOnly
                    ></textarea>
                  </p>
                </Modal.Body>
              </Modal>
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
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(meanOfThree);
                      setN(3);
                      setCurrent(true);
                    }}
                  >
                    {meanOfThree?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(meanOfThree?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestMeanOfThree);
                      setN(3);
                      setCurrent(false);
                    }}
                  >
                    {defaultTimeFormat(bestMeanOfThree.output)}
                  </a>
                </div>
              )}
              {solveHistory.length >= 5 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 5:</p>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(averageOfFive);
                      setN(5);
                      setCurrent(true);
                    }}
                  >
                    {averageOfFive?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(averageOfFive?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestOfFive);
                      setN(5);
                      setCurrent(false);
                    }}
                  >
                    {bestOfFive ? defaultTimeFormat(bestOfFive.output) : ''}
                  </a>
                </div>
              )}

              {solveHistory.length >= 12 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 12:</p>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(averageOfTwelve);
                      setN(12);
                      setCurrent(true);
                    }}
                  >
                    {averageOfTwelve?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(averageOfTwelve?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestOfTwelve);
                      setN(12);
                      setCurrent(false);
                    }}
                  >
                    {bestOfTwelve ? defaultTimeFormat(bestOfTwelve.output) : ''}
                  </a>
                </div>
              )}
              {solveHistory.length >= 25 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 25:</p>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(averageOfTwentyFive);
                      setN(25);
                      setCurrent(true);
                    }}
                  >
                    {averageOfTwentyFive?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(averageOfTwentyFive?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestOfTwentyFive);
                      setN(25);
                      setCurrent(false);
                    }}
                  >
                    {bestOfTwentyFive
                      ? defaultTimeFormat(bestOfTwentyFive?.output)
                      : ''}
                  </a>
                </div>
              )}

              {solveHistory.length >= 50 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 50:</p>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(averageOfFifty);
                      setN(50);
                      setCurrent(true);
                    }}
                  >
                    {averageOfFifty?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(averageOfFifty?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestOfFifty);
                      setN(50);
                      setCurrent(false);
                    }}
                  >
                    {bestOfFifty ? defaultTimeFormat(bestOfFifty?.output) : ''}
                  </a>
                </div>
              )}

              {solveHistory.length >= 100 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 100:</p>{' '}
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(averageOfHundred);
                      setN(100);
                      setCurrent(true);
                    }}
                  >
                    {averageOfHundred?.output === 'DNF'
                      ? 'DNF'
                      : defaultTimeFormat(averageOfHundred?.output)}
                  </a>
                  <a
                    id={darkTheme ? 'dark' : ''}
                    className='sessionAvgTime'
                    onClick={() => {
                      handleModal(bestOfHundred);
                      setN(100);
                      setCurrent(false);
                    }}
                  >
                    {bestOfHundred
                      ? defaultTimeFormat(bestOfHundred?.output)
                      : ''}
                  </a>
                </div>
              )}
              {show && (
                <SessionModal
                  data={data}
                  show={show}
                  setShow={setShow}
                  current={current}
                  n={n}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Session;
