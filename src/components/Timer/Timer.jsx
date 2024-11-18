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
  const [pauseInspection, setPauseInspection] = useState(true);

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
    if (e.code === 'Space' || e.type === 'touchstart') {
      setSpaceHeld(true);
      if (isInspectionActive && inspectionStarted) {
        setPauseInspection(true);
      }
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
    if (e.code === 'Space' || e.type === 'touchend') {
      setSpaceHeld(false);
      if (!isRunning && !ignoreSpaceUp && !isInputActive) {
        // Starts normal timer
        if (!isInspectionActive) {
          setRunning(true);
          handleStart();
          // Starts Inspection countdown
        } else if (isInspectionActive && !inspectionStarted) {
          setPauseInspection(false);
          setInspectionCountdownStarted(true);
          setInspectionStarted(true);
          // Starts normal timer after Inspection countdown
        } else if (isInspectionActive && inspectionStarted) {
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
        if (inspectionCountdownStarted) {
          setColor('green');
        }
        setColor('green');
        setIgnoreSpaceUp(true); // Ignore Space UP for 350ms to not accidentally start the timer
        const timer = setTimeout(() => {
          setColor('green'); // Turns green when timer can run
          setIgnoreSpaceUp(false);
        }, 50);
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
      onTimerStopped(solvingTime);
    }
  }, [isRunning]);

  // INSPECTION COUNTDOWN
  useEffect(() => {
    if (inspectionCountdownStarted == true) {
      setInspectionCountdown(15);
      const inspectionInterval = setInterval(() => {
        setInspectionCountdown((prevTime) => {
          if (prevTime == -2) {
            clearInterval(inspectionInterval);
            setInspectionCountdown(-2);
            setInspectionStarted(false);
          } else {
            return prevTime - 1;
          }
        });
      }, 1000);
      return () => clearInterval(inspectionInterval);
    }
  }, [inspectionCountdownStarted]);

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
    if (pauseInspection) {
      setInspectionCountdownStarted(false);
      setPauseInspection(false);
      return inspectionCountdown;
    }
    if (inspectionCountdown <= 0 && inspectionCountdown > -2) {
      return '+2';
    } else if (inspectionCountdown == -2) return 'DNF';
    else {
      return inspectionCountdown;
    }
  };
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <svg
            className={
              isInspectionActive && !isRunning && !inspectionCountdownStarted
                ? 'show'
                : 'focusHidden'
            }
            width='32px'
            height='32px'
            viewBox='0 0 3333.000000 3333.000000'
          >
            <g
              transform='translate(0.000000,3333.000000) scale(0.100000,-0.100000)'
              fill='#74777b'
              stroke='none'
            >
              <path
                d='M13779 33310 c-2670 -110 -5168 -912 -7353 -2360 -1111 -736 -2116
-1623 -2976 -2625 -990 -1155 -1779 -2435 -2360 -3831 -593 -1423 -952 -2952
-1060 -4519 -43 -621 -41 -1372 5 -2010 169 -2336 906 -4590 2148 -6565 940
-1494 2139 -2796 3552 -3857 1694 -1271 3639 -2145 5715 -2568 757 -154 1472
-240 2290 -276 296 -13 1134 -7 1395 10 1269 84 2340 281 3491 642 1658 520
3282 1388 4624 2472 l155 125 3780 -3777 c2079 -2078 3809 -3800 3845 -3828
211 -163 411 -260 640 -309 117 -25 353 -25 470 -1 531 112 971 501 1128 997
133 421 52 865 -226 1235 -25 33 -1521 1538 -3326 3345 -1805 1807 -3515 3520
-3800 3807 l-519 521 130 164 c1053 1327 1844 2787 2373 4378 647 1947 868
4033 644 6085 -397 3647 -2181 6995 -4994 9375 -1967 1663 -4336 2761 -6875
3184 -515 86 -1041 144 -1605 176 -246 14 -1045 20 -1291 10z m1036 -2800
c1663 -79 3183 -472 4635 -1196 933 -466 1756 -1025 2555 -1734 193 -172 723
-702 895 -895 1263 -1423 2130 -3049 2585 -4850 557 -2203 451 -4549 -302
-6670 -1090 -3067 -3414 -5526 -6418 -6790 -970 -408 -2025 -685 -3085 -809
-473 -56 -835 -76 -1360 -76 -525 0 -878 20 -1360 76 -2129 248 -4160 1099
-5846 2450 -714 573 -1388 1262 -1948 1993 -1284 1674 -2090 3690 -2305 5766
-50 476 -56 613 -56 1230 0 618 7 772 56 1225 259 2413 1246 4631 2875 6460
168 189 567 594 764 775 1651 1522 3689 2524 5883 2894 430 73 960 130 1387
150 258 12 805 12 1045 1z'
              />
              <path
                d='M21755 26094 c-99 -22 -209 -67 -285 -115 -49 -32 -1274 -1251 -5050
-5025 l-4985 -4984 -2518 2538 c-1385 1395 -2556 2571 -2602 2612 -121 110
-222 165 -376 207 -87 24 -298 23 -394 0 -91 -23 -235 -92 -310 -150 -33 -25
-483 -470 -1001 -989 -684 -685 -952 -961 -983 -1008 -93 -146 -137 -316 -128
-500 9 -174 61 -323 159 -455 67 -90 7593 -7662 7660 -7707 286 -190 616 -203
915 -37 74 40 431 396 6286 6248 6757 6754 6288 6277 6354 6462 43 116 57 217
50 347 -9 163 -59 308 -151 436 -25 34 -471 487 -993 1008 -989 988 -1003
1000 -1148 1061 -103 43 -175 58 -305 62 -91 4 -144 0 -195 -11z'
              />
            </g>
          </svg>

          <h1
            className='timer'
            style={{ color: isSpaceHeld ? color : '' }}
            onClick={() => {
              setInputContent('');
              setInputActive(true);
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
