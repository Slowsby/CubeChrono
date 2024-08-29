import React, { useEffect, useState } from "react";
import { randomScrambleForEvent } from "cubing/scramble";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Scramble = ({
  toScramble,
  onScrambleGenerated,
  changeTheme,
  darkTheme,
}) => {
  const [scramble, setScramble] = useState("");
  const [lastScramble, setLastScramble] = useState("");

  const generateScramble = async () => {
    setLastScramble(scramble);
    const toGenerate = await randomScrambleForEvent("333");
    setScramble(toGenerate.toString());
    onScrambleGenerated(toGenerate.toString());
  };

  useEffect(() => {
    generateScramble();
  }, []);

  useEffect(() => {
    generateScramble();
  }, [toScramble]);

  const themeIcon = (darkTheme) => {
    if (darkTheme) {
      return (
        <svg
          id='svg'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0, 0, 400,400'
        >
          <g id='svgg'>
            <path
              id='path0'
              d='M195.460 12.530 C 193.767 14.108,193.750 14.379,193.750 40.265 C 193.750 70.020,193.646 69.531,200.000 69.531 C 206.354 69.531,206.250 70.020,206.250 40.265 C 206.250 10.657,206.310 10.938,200.000 10.938 C 198.231 10.938,196.528 11.535,195.460 12.530 M65.980 65.980 C 61.370 70.590,62.089 71.749,81.840 91.551 C 101.400 111.162,103.284 112.341,107.813 107.813 C 112.341 103.284,111.162 101.400,91.551 81.840 C 71.749 62.089,70.590 61.370,65.980 65.980 M308.449 81.840 C 291.106 99.138,290.625 99.703,290.625 102.760 C 290.625 107.554,292.303 109.375,296.720 109.375 L 300.382 109.375 318.160 91.551 C 337.911 71.749,338.630 70.590,334.020 65.980 C 329.410 61.370,328.251 62.089,308.449 81.840 M187.118 95.312 C 109.516 105.102,69.156 192.740,112.103 258.203 C 156.753 326.263,261.187 318.798,295.274 245.109 C 330.167 169.680,269.013 84.981,187.118 95.312 M218.349 109.759 C 291.089 125.404,317.116 215.903,263.438 266.540 C 204.560 322.083,108.297 280.796,108.297 200.000 C 108.297 141.799,162.119 97.666,218.349 109.759 M12.530 195.460 C 10.415 197.731,10.415 202.269,12.530 204.540 C 14.108 206.233,14.379 206.250,40.265 206.250 C 70.020 206.250,69.531 206.354,69.531 200.000 C 69.531 193.646,70.020 193.750,40.265 193.750 C 14.379 193.750,14.108 193.767,12.530 195.460 M332.031 195.313 C 330.990 196.354,330.469 197.917,330.469 200.000 C 330.469 206.354,329.980 206.250,359.735 206.250 C 385.621 206.250,385.892 206.233,387.470 204.540 C 389.585 202.269,389.585 197.731,387.470 195.460 C 385.080 192.895,334.583 192.760,332.031 195.313 M81.840 308.449 C 62.089 328.251,61.370 329.410,65.980 334.020 C 70.590 338.630,71.749 337.911,91.551 318.160 C 111.162 298.600,112.341 296.716,107.813 292.188 C 103.284 287.659,101.400 288.838,81.840 308.449 M292.188 292.188 C 287.659 296.716,288.838 298.600,308.449 318.160 C 328.251 337.911,329.410 338.630,334.020 334.020 C 338.630 329.410,337.911 328.251,318.160 308.449 C 298.600 288.838,296.716 287.659,292.188 292.188 M195.313 332.031 C 193.812 333.531,193.750 334.635,193.750 359.735 C 193.750 389.343,193.690 389.063,200.000 389.063 C 206.310 389.063,206.250 389.343,206.250 359.735 C 206.250 329.980,206.354 330.469,200.000 330.469 C 197.917 330.469,196.354 330.990,195.313 332.031 '
              stroke='none'
              fill='#ffffff'
            ></path>
          </g>
        </svg>
      );
    } else {
      return (
        <svg
          id='svg'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0, 0, 400,400'
        >
          <g id='svgg'>
            <path
              id='path0'
              d='M124.819 26.072 C 115.296 29.592,94.024 44.533,81.522 56.482 C 17.106 118.049,6.093 218.716,55.692 292.578 C 130.071 403.342,292.189 402.470,365.132 290.913 C 373.717 277.784,375.208 273.944,374.878 265.812 C 374.114 246.973,361.094 238.288,338.930 241.837 C 236.562 258.226,142.471 163.894,158.147 60.592 C 160.342 46.126,158.689 39.038,151.491 32.052 C 145.028 25.780,132.940 23.070,124.819 26.072 M133.325 52.539 C 131.822 58.565,130.907 71.202,130.961 85.156 C 131.400 196.790,231.001 283.148,341.602 267.790 C 345.791 267.209,349.219 266.877,349.219 267.053 C 349.219 267.764,343.158 277.333,338.990 283.203 C 290.316 351.749,192.889 370.022,123.302 323.655 C 24.401 257.757,26.712 115.746,127.696 53.739 C 133.244 50.331,133.911 50.189,133.325 52.539 '
              stroke='none'
              fill='#000000'
            ></path>
          </g>
        </svg>
      );
    }
  };

  useEffect(() => {
    themeIcon(darkTheme);
  }, [darkTheme]);
  return (
    <Container className='scrambleContainer' fluid>
      <Row>
        <Col>
          <Button
            variant='link'
            onClick={() => {
              if (lastScramble) {
                setScramble(lastScramble);
                onScrambleGenerated(lastScramble);
                setLastScramble("");
              }
            }}
            disabled={!lastScramble}
          >
            Last
          </Button>
          /
          <Button variant='link' onClick={generateScramble}>
            Next
          </Button>
        </Col>
        <Col className='text-end'>
          <Button
            variant={darkTheme ? "secondary" : "light"}
            className='themeBtn'
            onClick={changeTheme}
          >
            {themeIcon(darkTheme)}
          </Button>
        </Col>
      </Row>
      <Row className='justify-content-center'>
        <Col className='col-auto'>
          <h1 style={{ whiteSpace: "pre-wrap", wordSpacing: "50%" }}>
            {scramble}
          </h1>
        </Col>
      </Row>
      <hr />
    </Container>
  );
};

export default Scramble;
