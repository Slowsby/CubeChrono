import Modal from 'react-bootstrap/Modal';
import React from 'react';

export const Settings = ({ show, setShow }) => {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName='customModal'
      aria-labelledby='customModal'
    >
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title id='customModal'>Inratable</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody'>
        <p>T'as les crampté??</p>
      </Modal.Body>
    </Modal>
  );
};
