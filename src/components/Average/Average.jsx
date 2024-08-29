import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Average.css";
const Average = ({ solveHistory }) => {
  let averageOfFive;
  let averageOfTwelve;
  if (solveHistory.length >= 5) {
    let lastFiveSolves = solveHistory.slice(-5);
    averageOfFive = (
      lastFiveSolves.reduce((acc, el) => acc + el["time"], 0) / 5
    ).toFixed(2);
  }
  if (solveHistory.length >= 12) {
    let lastTwelveSolves = solveHistory.slice(-12);
    averageOfTwelve = (
      lastTwelveSolves.reduce((acc, el) => acc + el["time"], 0) / 12
    ).toFixed(2);
  }
  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <p className='averageOfFive'>
            {averageOfFive ? "ao5: " : ""} {averageOfFive}
          </p>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <p className='averageOfTwelve'>
            {averageOfTwelve ? "ao12: " : ""} {averageOfTwelve}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Average;
