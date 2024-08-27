import React, { useEffect, useState } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import "./Scramble.css";

const Scramble = ({ toScramble }) => {
  const [scramble, setScramble] = useState("");
  const [lastScramble, setLastScramble] = useState("");

  const generateScramble = async () => {
    setLastScramble(scramble);
    const toGenerate = await randomScrambleForEvent("333");
    setScramble(toGenerate.toString());
  };

  useEffect(() => {
    generateScramble();
  }, []);

  useEffect(() => {
    generateScramble();
  }, [toScramble]);

  return (
    <>
      <span
        className={lastScramble ? "last" : ""}
        onClick={() => {
          if (lastScramble) {
            setScramble(lastScramble);
            setLastScramble("");
          }
        }}
      >
        Last
      </span>
      /
      <span className='next' onClick={generateScramble}>
        Next
      </span>
      <p className='scramble'>{scramble}</p>
      <hr />
    </>
  );
};

export default Scramble;
