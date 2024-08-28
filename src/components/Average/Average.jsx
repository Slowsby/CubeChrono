import React from "react";
import "./Average.css";

const Average = ({ solveHistory }) => {
  let averageOfFive;
  let averageOfTwelve;
  if (solveHistory.length >= 5) {
    let lastFiveSolves = solveHistory.slice(-5);
    console.log("last three solves", lastFiveSolves);
    averageOfFive = (
      lastFiveSolves.reduce((acc, el) => acc + el["time"], 0) / 5
    ).toFixed(2);
  }
  if (solveHistory.length >= 12) {
    let lastTwelveSolves = solveHistory.slice(-12);
    console.log("last three solves", lastTwelveSolves);
    averageOfTwelve = (
      lastTwelveSolves.reduce((acc, el) => acc + el["time"], 0) / 5
    ).toFixed(2);
  }
  return (
    <div className='averageDiv'>
      <p className='averageOfFive'>
        {averageOfFive ? "ao5: " : ""} {averageOfFive}
      </p>
      <p className='averageOfTwelve'>
        {averageOfTwelve ? "ao12: " : ""} {averageOfTwelve}
      </p>
    </div>
  );
};

export default Average;
