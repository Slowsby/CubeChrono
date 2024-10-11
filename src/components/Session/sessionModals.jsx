import Modal from 'react-bootstrap/Modal';
import React from 'react';
import { defaultTimeFormat } from '../../utils/defaultTimeFormat';
import './Session.css';

export const SessionModal = ({ data, show, setShow, current, n }) => {
  let title;
  const { output, arr } = data;
  switch (n.toString()) {
    case '3':
      title = 'Mo3';
      break;
    case '5':
      title = 'Ao5';
      break;
    case '12':
      title = 'Ao12';
      break;
    case '25':
      title = 'Ao25';
      break;
    case '50':
      title = 'Ao50';
      break;
    case '100':
      title = 'Ao100';
      break;
    default:
      break;
  }
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName='customModal'
      aria-labelledby='customModal'
    >
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title id='customModal'>
          {current ? 'Current ' : 'Best '}
          {`${title}: ${defaultTimeFormat(output)}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody'>
        <p>
          Date
          <br />
          <input
            className='inputScramble'
            value={new Date(arr[0].date).toLocaleString()}
            readOnly
          />
        </p>
        <p>
          Plain text
          <textarea
            className='inputScramble textarea'
            cols={90}
            rows={10}
            value={arr
              .map(
                (el, index) =>
                  `- ${index + 1}: ${el.dnf ? `DNF(${defaultTimeFormat(el.time)})` : el.penalty ? `(${defaultTimeFormat(el.time)})+2` : defaultTimeFormat(el.time)}, ${el.scramble}`
              )
              .join('\n')}
            readOnly
          />
        </p>
      </Modal.Body>
    </Modal>
  );
};
