import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Session.css';

const Session = ({ darkTheme, solveHistory, exportSession }) => {
  const [session, setSession] = useState(['session1']);
  const [currentSession, setCurrentSession] = useState('session1');
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
    if (event.target.value === 'newSession') {
      const newSession = 'session' + (session.length + 1);
      setSession((prevSession) => [...prevSession, newSession]);
      setCurrentSession(newSession);
    } else {
      setCurrentSession(event.target.value);
    }
    console.log(event.target.value);
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
              defaultValue={currentSession}
            >
              {session.map((el, index) => {
                return (
                  <option key={index} value={el}>
                    Session {index + 1}
                  </option>
                );
              })}
              <option value='newSession'>New Session</option>
            </select>
          </form>
          <div>
            <h5>
              {/*Show the total amount of valid solves / All solves */}
              Solve {solveHistory.filter((el) => !el.dnf).length}/
              {solveHistory.length}
            </h5>
            <h6>Mean : {meanTotal ? meanTotal.toFixed(2) : ''}</h6>
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
                {bestTime ? bestTime.toFixed(2) : 'N/A'}
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
                {worstTime ? worstTime.toFixed(2) : 'N/A'}
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
                  <p className='sessionAvgTime'>{meanOfThree}</p>
                  <p className='sessionAvgTime'>{bestMeanOfThree.toFixed(2)}</p>
                </div>
              )}
              {solveHistory.length >= 5 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 5:</p>
                  <p className='sessionAvgTime'>{averageOfFive}</p>
                  <p className='sessionAvgTime'>
                    {bestOfFive ? bestOfFive.toFixed(2) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 12 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 12:</p>
                  <p className='sessionAvgTime'>{averageOfTwelve}</p>
                  <p className='sessionAvgTime'>
                    {bestOfTwelve ? bestOfTwelve.toFixed(2) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 25 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 25:</p>
                  <p className='sessionAvgTime'>{averageOfTwentyFive}</p>
                  <p className='sessionAvgTime'>
                    {bestOfTwentyFive ? bestOfTwentyFive.toFixed(2) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 50 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 50:</p>
                  <p className='sessionAvgTime'>{averageOfFifty}</p>
                  <p className='sessionAvgTime'>
                    {bestOfFifty ? bestOfFifty.toFixed(2) : ''}
                  </p>
                </div>
              )}

              {solveHistory.length >= 100 && (
                <div className='avgSession d-flex justify-content-between'>
                  <p style={{ width: '80px' }}>Avg of 100:</p>
                  <p className='sessionAvgTime'>{averageOfHundred}</p>
                  <p className='sessionAvgTime'>
                    {bestOfHundred ? bestOfHundred.toFixed(2) : ''}
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
