import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Timer.css";

const Timer = ({ onTimerStopped, solveTimeOnLoad }) => {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);
  const [isRunning, setRunning] = useState(false);
  const [isSpaceHeld, setSpaceHeld] = useState(false);
  const [ignoreSpaceUp, setIgnoreSpaceUp] = useState(false);
  const [ignore, setIgnore] = useState(false);
  const [color, setColor] = useState("");

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
    if (e.code === "Space" || e.type === "touchstart") {
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
    if (e.code === "Space" || e.type === "touchend") {
      setSpaceHeld(false);
      if (!isRunning && !ignoreSpaceUp) {
        setRunning(true);
        handleStart();
      }
    }
  };

  // If a startTime exists and the timer stopped running, it exports the current time
  useEffect(() => {
    if (!isRunning && startTime) {
      const solvingTime = ((now - startTime) / 1000).toFixed(2);
      onTimerStopped(solvingTime);
    }
  }, [isRunning]);

  useEffect(() => {
    window.addEventListener("keydown", spaceDown);
    window.addEventListener("keyup", spaceUp);
    window.addEventListener("touchstart", spaceDown);
    window.addEventListener("touchend", spaceUp);
    return () => {
      window.removeEventListener("keydown", spaceDown);
      window.removeEventListener("keyup", spaceUp);
      window.removeEventListener("touchstart", spaceDown);
      window.removeEventListener("touchend", spaceUp);
    };
  }, [ignoreSpaceUp, isRunning]);

  // Turns the timer red on Space DOWN
  useEffect(() => {
    if (isSpaceHeld && !isRunning && !ignore) {
      setColor("red");
      setIgnoreSpaceUp(true); // Ignore Space UP for 350ms to not accidentally start the timer
      const timer = setTimeout(() => {
        setColor("green"); // Turns green when timer can run
        setIgnoreSpaceUp(false);
      }, 350);
      return () => {
        clearTimeout(timer);
      };
    } else {
      setColor("red");
    }
  }, [isSpaceHeld, isRunning, ignore]);

  // render the time saved in localStorage if timer has never run
  const renderTime = () => {
    if (!isRunning && !startTime && solveTimeOnLoad) {
      return solveTimeOnLoad;
    } else if (!isRunning) {
      return secondsPassed.toFixed(2);
    } else if (isRunning) {
      return secondsPassed.toFixed(1);
    }
  };
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <h1 className='timer' style={{ color: isSpaceHeld ? color : "" }}>
            {renderTime()}
          </h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Timer;
