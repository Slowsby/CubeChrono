import React, { useEffect, useState, useRef } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { defaultTimeFormat } from '../../utils/defaultTimeFormat';
import './Timer.css';

const Timer = ({
  onTimerStopped,
  darkTheme,
  solveHistory,
  exportRunning,
  isInspectionActive
}) => {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [isRunning, setRunning] = useState(false);
  const [isSpaceHeld, setSpaceHeld] = useState(false);
  const [ignoreSpaceUp, setIgnoreSpaceUp] = useState(false);
  const [ignore, setIgnore] = useState(false);
  const [color, setColor] = useState('');
  const [isInputActive, setInputActive] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [inspectionCountdown, setInspectionCountdown] = useState(15);
  const [inspectionCountdownStarted, setInspectionCountdownStarted] =
    useState(false);
  const [inspectionStarted, setInspectionStarted] = useState(false);
  const [inspectionTimeEnd, setInspectionTimeEnd] = useState(15);
  const [registerInspectionTime, setRegisterInspectionTime] = useState(false);
  const [escDnf, setEscDnf] = useState(false);
  const [penalty, setPenalty] = useState('');

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
  };

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  //Stops the timer on Space DOWN.
  const spaceDown = (e) => {
    if (e.code === 'Escape' && isRunning) {
      setRunning(false);
      handleStop();
      setEscDnf(true);
      return;
    }
    if (e.code === 'Space' || e.type === 'touchstart') {
      setSpaceHeld(true);
      if (isRunning) {
        setRunning(false);
        handleStop();
        setIgnoreSpaceUp(true); // Stops the spaceUP function to run
        setIgnore(true); // Stops the color from turning green on timer stop
        setTimeout(() => {
          setIgnoreSpaceUp(false);
          setIgnore(false);
        }, 1000);
      }
    }
  };

  // Starts the timer on Space UP
  const spaceUp = (e) => {
    if (e.code === 'Escape') {
      setInputActive(false);
    }
    if (e.code === 'Space' || e.type === 'touchend') {
      setSpaceHeld(false);
      if (!isRunning && !ignoreSpaceUp && !isInputActive) {
        setEscDnf(false);
        // Starts normal timer
        if (!isInspectionActive) {
          setRunning(true);
          handleStart();
          // Starts Inspection countdown
        } else if (isInspectionActive && !inspectionStarted) {
          setInspectionCountdownStarted(true);
          setInspectionStarted(true);
          // Starts normal timer after Inspection countdown
        } else if (isInspectionActive && inspectionStarted) {
          if (inspectionCountdownStarted) {
            setRegisterInspectionTime(true);
          }
          setInspectionStarted(false);
          setInspectionCountdownStarted(false);
          setRunning(true);
          handleStart();
        }
      }
    }
  };

  const preventSpaceDefault = (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
    }
  };
  useEffect(() => {
    window.addEventListener('keyup', preventSpaceDefault);
    window.addEventListener('keydown', preventSpaceDefault);
    return () => {
      window.removeEventListener('keyup', preventSpaceDefault);
      window.removeEventListener('keydown', preventSpaceDefault);
    };
  });
  useEffect(() => {
    window.addEventListener('keydown', spaceDown);
    window.addEventListener('keyup', spaceUp);
    window.addEventListener('touchstart', spaceDown);
    window.addEventListener('touchend', spaceUp);
    return () => {
      window.removeEventListener('keydown', spaceDown);
      window.removeEventListener('keyup', spaceUp);
      window.removeEventListener('touchstart', spaceDown);
      window.removeEventListener('touchend', spaceUp);
    };
  }, [ignoreSpaceUp, isRunning]);

  // Turns the timer red on Space DOWN
  useEffect(() => {
    if (isSpaceHeld && !isRunning && !ignore) {
      if (isInspectionActive) {
        setColor('red');
        setIgnoreSpaceUp(true); // Ignore Space UP for 350ms to not accidentally start the timer
        const timer = setTimeout(() => {
          setColor('green'); // Turns green when timer can run
          setIgnoreSpaceUp(false);
        }, 200);
        return () => {
          clearTimeout(timer);
        };
      }
      setColor('red');
      setIgnoreSpaceUp(true); // Ignore Space UP for 350ms to not accidentally start the timer
      const timer = setTimeout(() => {
        setColor('green'); // Turns green when timer can run
        setIgnoreSpaceUp(false);
      }, 350);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setColor('red');
    }
  }, [isSpaceHeld, isRunning, ignore, isInspectionActive]);

  // If a startTime exists and the timer stopped running, it exports the current time
  useEffect(() => {
    exportRunning(isRunning);
    if (!isRunning && startTime) {
      const solvingTime = ((now - startTime) / 1000).toFixed(2);
      isInspectionActive
        ? onTimerStopped(solvingTime, penalty)
        : // When ESC is pressed, cancels time, sends DNF penalty to the stopped time
          escDnf
          ? onTimerStopped(solvingTime, 'DNF')
          : onTimerStopped(solvingTime, 'none');
    }
  }, [isRunning, penalty, escDnf]);

  useEffect(() => {
    if (inspectionTimeEnd <= 0 && inspectionTimeEnd > -2) {
      setPenalty('+2');
    } else if (inspectionTimeEnd <= -2) {
      setPenalty('DNF');
    } else {
      setPenalty(`${inspectionTimeEnd}`);
    }
  }, [inspectionTimeEnd]);

  useEffect(() => {
    if (registerInspectionTime) {
      setInspectionTimeEnd(inspectionCountdown);
    }
    setRegisterInspectionTime(false);
  }, [registerInspectionTime, inspectionCountdown]);
  // INSPECTION COUNTDOWN
  useEffect(() => {
    if (inspectionCountdownStarted == true) {
      setInspectionCountdown(15);
      const inspectionInterval = setInterval(() => {
        setInspectionCountdown((prevTime) => {
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(inspectionInterval);
    }
  }, [inspectionCountdownStarted, inspectionTimeEnd]);

  const renderTime = () => {
    if (!isRunning && solveHistory.length > 0) {
      // If a solve history exists, show the last entry.
      // If a time is deleted in History component, it will correctly update
      return defaultTimeFormat(
        solveHistory[solveHistory.length - 1].time,
        false
      );
    } else if (!isRunning) {
      return defaultTimeFormat(secondsPassed, false); // show the initial number
    } else if (isRunning) {
      return defaultTimeFormat(secondsPassed, true); // When timer is running, only show the tenths
    }
  };

  const renderInspectionTimer = () => {
    if (inspectionStarted) {
      return renderCountDown();
    } else {
      return renderTime();
    }
  };
  const renderCountDown = () => {
    if (inspectionCountdown <= 0 && inspectionCountdown > -2) {
      return '+2';
    } else if (inspectionCountdown <= -2) return 'DNF';
    else {
      return inspectionCountdown;
    }
  };
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <svg width='48px' height='48px' viewBox='0 0 512 512'>
            <path
              className={
                isInspectionActive && !inspectionStarted && !isRunning
                  ? 'show'
                  : 'focusHidden'
              }
              fill='#74777b'
              d='M179.594 20.688v41.406h143.25V20.687h-143.25zM256.03 82C143.04 82 51.25 173.727 51.25 286.656c0 112.93 91.788 204.656 204.78 204.656 112.994 0 204.75-91.728 204.75-204.656C460.78 173.73 369.025 82 256.03 82zm0 35.625c93.42 0 169.126 75.665 169.126 169.03 0 93.368-75.706 169.564-169.125 169.564-93.417 0-169.155-76.197-169.155-169.564 0-93.366 75.736-169.03 169.156-169.03zm76.19 20.28l-72.47 107.5c10.67 1.036 20.516 6.045 27.625 13.814l44.844-121.314zm-85.533 1.064v45.31c3.077-.275 6.196-.405 9.344-.405 3.155 0 6.263.13 9.345.406v-45.31h-18.688zm-88.53 36.655l-13.22 13.22L177 220.874c3.992-4.784 8.432-9.198 13.22-13.188l-32.064-32.062zm195.75 0l-32.063 32.063c4.786 3.99 9.196 8.403 13.187 13.187l32.064-32.03-13.188-13.22zm-98.344 81.22c-2.08.01-4.195.243-6.313.686-16.948 3.544-27.7 20.005-24.156 36.94 3.544 16.932 20.02 27.698 36.97 24.155 16.946-3.543 27.7-20.004 24.155-36.938-3.102-14.816-16.104-24.925-30.658-24.843zM108.28 277.31V296h45.314c-.278-3.08-.406-6.192-.406-9.344 0-3.146.13-6.27.406-9.344H108.28zm250.157 0c.277 3.075.438 6.197.438 9.344 0 3.153-.16 6.264-.438 9.344h45.344v-18.688H358.44zm-60.062 6.72c.993 10.522-1.968 20.742-7.813 28.937l124 19.092-116.187-48.03zM176.97 352.405l-32.032 32.03 13.218 13.22 32.063-32.03c-4.798-4-9.253-8.424-13.25-13.22zm158.093 0c-4 4.796-8.423 9.22-13.22 13.22l32.063 32.03 13.188-13.22-32.03-32.03zM246.688 389v45.313h18.687V389c-3.082.278-6.19.438-9.344.438-3.147 0-6.266-.16-9.342-.438z'
            />
          </svg>

          <h1
            className='timer'
            style={{ color: isSpaceHeld ? color : '' }}
            onClick={() => {
              if (!isRunning) {
                setInputContent('');
                setInputActive(true);
              }
            }}
          >
            {/*Click on the timer activates input,  pressing Enter validates the manual input*/}
            {isInputActive ? (
              <input
                autoFocus
                type='number'
                className={`${darkTheme ? 'dark' : ''} timerInput`}
                value={inputContent}
                onChange={(e) => setInputContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                    if (Number(inputContent) > 0) {
                      onTimerStopped(Number(inputContent).toFixed(2)); // Submit the input value
                      setInputActive(false);
                    } else {
                      setInputActive(false);
                    }
                  }
                }}
              />
            ) : isInspectionActive ? (
              renderInspectionTimer()
            ) : (
              renderTime()
            )}
          </h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Timer;
