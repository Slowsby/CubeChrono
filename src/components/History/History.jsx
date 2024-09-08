import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import './History.css';
import Alert from 'react-bootstrap/Alert';

const History = ({
  solveHistory,
  darkTheme,
  deleteFromHistory,
  addTwo,
  addDnf,
  deletePenalty,
  clearSolveHistory,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [historyCleared, setHistoryCleared] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = (index) => {
    setSelectedIndex(index);
    setShowModal(true);
  };
  const renderHistory = () => {
    return solveHistory
      .map((el, index) => (
        <div key={index} className='mainDivHistory'>
          <div className='divHistory'>
            <span className='timeIndex' style={{ width: '50px' }}>
              {index + 1}.
            </span>
            <a
              className={darkTheme ? 'timeDark' : 'time'}
              onClick={() => handleShow(index)}
            >
              {el.dnf ? `DNF` : el.time.toFixed(2)}
              <span className='penaltyHistory'>
                {el.dnf ? '' : el.penalty ? `+2` : ''}
              </span>
            </a>
            <div className='buttons'>
              <a className='plusTwoBtn' onClick={() => addTwo(index)}>
                <b>+2</b>
              </a>{' '}
              <a className='dnfBtn' onClick={() => addDnf(index)}>
                <b>DNF</b>
              </a>{' '}
              <a className='deleteBtn' onClick={() => deleteFromHistory(index)}>
                <b>X</b>
              </a>
            </div>
          </div>
        </div>
      ))
      .reverse();
  };
  const renderModal = () => {
    const finalTime = (index) => {
      if (solveHistory[index].penalty && solveHistory[index].dnf) {
        return `DNF (${solveHistory[index].time.toFixed(2)}+2)`;
      } else if (solveHistory[index].penalty) {
        return `${solveHistory[index].time.toFixed(2)}+2`;
      } else {
        return solveHistory[index].dnf
          ? `DNF (${solveHistory[index].time.toFixed(2)})`
          : solveHistory[index].time.toFixed(2);
      }
    };
    return (
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header className='modalHeader' closeButton>
          <Modal.Title>Solve #{selectedIndex + 1}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          <p>
            Time <br />
            <input
              className='inputTime'
              value={finalTime(selectedIndex)}
              readOnly
            ></input>
          </p>
          <p>
            Scramble
            <br />
            <input
              className='inputScramble'
              value={solveHistory[selectedIndex].scramble}
              readOnly
            ></input>
          </p>
          <p className='modalBtn'>
            <a
              className='modalDeletePenaltyBtn'
              onClick={() => deletePenalty(selectedIndex)}
            >
              <b>OK</b>
            </a>{' '}
            <a
              className='modalPlusTwoBtn'
              onClick={() => addTwo(selectedIndex)}
            >
              <b>+2</b>
            </a>{' '}
            <a className='modalDnfBtn' onClick={() => addDnf(selectedIndex)}>
              <b>DNF</b>
            </a>{' '}
            <a
              className='modalDeleteBtn'
              onClick={() => {
                setShowModal(false);
                deleteFromHistory(selectedIndex);
              }}
            >
              <b>X</b>
            </a>
          </p>
        </Modal.Body>
      </Modal>
    );
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
  }, []);

  return (
    <Container fluid>
      <Row className='justify-content-center'>
        <Col
          className={
            darkTheme ? 'col-auto colHistoryDark' : 'col-auto colHistory'
          }
          onTouchEnd={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <h4 className='timeHistoryHeader'>Times</h4>
          <Button
            className='clearHistoryBtn'
            variant='outline-danger'
            onClick={() => setOpen(!open)}
            aria-controls='deleteConfirmation'
            aria-expanded={open}
          >
            Clear History
          </Button>
          <Collapse in={open}>
            <div id='deleteConfirmation'>
              <Button
                variant='outline-success'
                className='confirmationBtn'
                onClick={() => {
                  setOpen(!open);
                  if (solveHistory.length > 0) {
                    clearSolveHistory();
                    setHistoryCleared(true);
                  }
                  setShow(true);
                  setTimeout(() => {
                    setShow(false);
                  }, 750);
                  setTimeout(() => {
                    setHistoryCleared(false);
                  }, 950);
                }}
              >
                Sure?
              </Button>
            </div>
          </Collapse>
          <Alert className='confirmationAlert' show={show} variant='success'>
            {historyCleared ? 'Deleted history.' : 'Nothing to delete.'}
          </Alert>
          {renderHistory()}
          {showModal ? renderModal() : ' '}
        </Col>
      </Row>
    </Container>
  );
};

export default History;