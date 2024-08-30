import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";
import "./Average.css";
const Average = ({ solveHistory, darkTheme }) => {
  const [averageOfFive, setAverageOfFive] = useState(null);
  const [averageOfTwelve, setAverageOfTwelve] = useState(null);
  useEffect(() => {
    const calculateAvg = () => {
      if (solveHistory.length >= 5) {
        const lastFiveSolves = solveHistory.slice(-5).reverse();
        const sortedArray = lastFiveSolves.sort((a, b) => a.time - b.time);
        // The average solve is only counted excluding slowest and fastest time
        // After sorting array, exclude the slowest and fastest time
        const middleThree = sortedArray.slice(1, -1);
        const average = (
          middleThree.reduce((acc, el) => acc + el.time, 0) / 3
        ).toFixed(2);
        setAverageOfFive(average);
      }
      if (solveHistory.length >= 12) {
        // Same as above.
        const lastTwelveSolves = solveHistory.slice(-12).reverse();
        const sortedArray = lastTwelveSolves.sort((a, b) => a.time - b.time);
        const middleTen = sortedArray.slice(1, -1);
        const average = (
          middleTen.reduce((acc, el) => acc + el.time, 0) / 10
        ).toFixed(2);
        setAverageOfTwelve(average);
      }
    };
    calculateAvg();
  }, [solveHistory]);

  const renderAverage = (number) => {
    // Slice the last 'number' elements
    const lastSolvesArray = solveHistory.slice(-number).reverse();
    //Find the index of the location of the fastest time
    const lowestTimeIndex = lastSolvesArray.findIndex(
      (el) => el.time === Math.min(...lastSolvesArray.map((el) => el.time)),
    );
    //Find the index of the location of the slowest time
    const highestTimeIndex = lastSolvesArray.findIndex(
      (el) => el.time === Math.max(...lastSolvesArray.map((el) => el.time)),
    );
    return lastSolvesArray.map((el, index) => (
      <p key={index}>
        {index + 1}.{" "}
        <b>
          {/*If the current index is one of the two indices we searched, indicate in the history it is not counted by putting in in parentheses*/}
          {index === lowestTimeIndex || index === highestTimeIndex
            ? `(${el.time})`
            : el.time}
        </b>
        , {el.scramble}
      </p>
    ));
  };

  const ao5Popover = (
    <Popover id='popover-basic'>
      <Popover.Header className='avgPopoverHeader'>
        Average of 5: <b>{averageOfFive}</b>
        {/* <Button className='copyBtn' variant='outline-success'>
          Copy
        </Button> */}
      </Popover.Header>
      <Popover.Body
        className={darkTheme ? "avgPopoverBodyDark" : "avgPopoverHeader"}
      >
        {renderAverage(5)}
      </Popover.Body>
    </Popover>
  );

  const ao12Popover = (
    <Popover id='popover-basic'>
      <Popover.Header className='avgPopoverHeader'>
        Average of 12: <b>{averageOfTwelve}</b>
        <Button className='copyBtn' variant='outline-success'>
          Copy
        </Button>
      </Popover.Header>
      <Popover.Body
        className={darkTheme ? "avgPopoverBodyDark" : "avgPopoverHeader"}
      >
        {renderAverage(12)}
      </Popover.Body>
    </Popover>
  );
  const spaceDown = (e) => {
    if (e.key === "Space") {
      e.preventDefault();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", spaceDown);
    return () => {
      window.removeEventListener("keydown", spaceDown);
    };
  });
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <OverlayTrigger
            rootClose // close when clicking outside
            trigger='click'
            key='bottom'
            placement='bottom'
            overlay={ao5Popover}
          >
            <p className='averageOfFive'>ao5: {averageOfFive}</p>
          </OverlayTrigger>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <OverlayTrigger
            rootClose
            trigger='click'
            key='bottom'
            placement='bottom'
            overlay={ao12Popover}
          >
            <p className='averageOfFive'>ao12: {averageOfTwelve}</p>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
};

export default Average;
