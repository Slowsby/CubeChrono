import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import "./Average.css";
const Average = ({ solveHistory, darkTheme }) => {
  const [averageOfFive, setAverageOfFive] = useState(null);
  const [averageOfTwelve, setAverageOfTwelve] = useState(null);
  useEffect(() => {
    const calculateAvg = () => {
      if (solveHistory.length >= 5) {
        const lastFiveSolves = solveHistory.slice(-5).reverse();
        const sortedArray = lastFiveSolves.sort((a, b) => a.time - b.time);
        const dnfNumber = lastFiveSolves.filter((el) => el.dnf === true);
        if (dnfNumber.length >= 2) {
          setAverageOfFive("DNF");
        } else {
          // The average solve is only counted excluding slowest and fastest time
          // After sorting array, exclude the slowest and fastest time
          const middleThree = sortedArray.slice(1, -1);
          const average = (
            middleThree.reduce((acc, el) => acc + el.time, 0) / 3
          ).toFixed(2);
          setAverageOfFive(average);
        }
      } else {
        setAverageOfFive("--");
      }
      if (solveHistory.length >= 12) {
        // Same as above.
        const lastTwelveSolves = solveHistory.slice(-12).reverse();
        const sortedArray = lastTwelveSolves.sort((a, b) => a.time - b.time);
        const dnfNumber = lastTwelveSolves.filter((el) => el.dnf === true);
        console.log(dnfNumber);
        if (dnfNumber.length >= 2) {
          setAverageOfTwelve("DNF");
        } else {
          const middleTen = sortedArray.slice(1, -1);
          const average = (
            middleTen.reduce((acc, el) => acc + el.time, 0) / 10
          ).toFixed(2);
          setAverageOfTwelve(average);
        }
      } else {
        setAverageOfTwelve("--");
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
            ? `(${el.dnf ? `DNF(${el.time.toFixed(2)})` : `${el.time.toFixed(2)}`})`
            : el.dnf
              ? `DNF`
              : el.time.toFixed(2)}
          {el.penalty ? (
            <span className='penaltyAverage'>{el.dnf ? "" : `+2`}</span>
          ) : (
            ""
          )}
        </b>
        , {el.scramble}
      </p>
    ));
  };

  const copyAverage = (number) => {
    let copyText = `Average of ${number}: ${number === 5 ? averageOfFive : averageOfTwelve} \n`;
    copyText += [...solveHistory]
      .reverse()
      .slice(-number)
      .map((el, index) => {
        return `${index + 1}. ${el.dnf ? `DNF(${el.time.toFixed(2)})` : el.penalty ? `${el.time.toFixed(2)}+2` : el.time.toFixed(2)}   ${el.scramble}\n`;
      })
      .join("");
    navigator.clipboard.writeText(copyText);
    copyText = "";
  };

  const averagePopover = (number) => {
    return (
      <Popover
        id='popover-basic'
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <Popover.Header className='avgPopoverHeader'>
          Average of {number}:{" "}
          <b>{number === 5 ? averageOfFive : averageOfTwelve}</b>
          <Button
            className='copyBtn'
            variant='outline-success'
            onClick={() => copyAverage(number)}
          >
            Copy
          </Button>
        </Popover.Header>
        <Popover.Body
          className={darkTheme ? "avgPopoverBodyDark" : "avgPopoverHeader"}
        >
          {renderAverage(number)}
        </Popover.Body>
      </Popover>
    );
  };
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <OverlayTrigger
            rootClose // close when clicking outside
            trigger='click'
            key='bottom'
            placement='bottom'
            overlay={averagePopover(5)}
          >
            <a className='averageOfFive'>ao5: {averageOfFive}</a>
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
            overlay={averagePopover(12)}
          >
            <a className='averageOfFive'>ao12: {averageOfTwelve}</a>
          </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
};

export default Average;
