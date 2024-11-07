import Modal from 'react-bootstrap/Modal';
import React, { useEffect, useState } from 'react';
import './settings.css';

export const Settings = ({ show, setShow, changeTheme, focus }) => {
  const [isInspectionChecked, setIsInspectionChecked] = useState(false);
  const [inspectionTime, setInspectionTime] = useState(15);
  const [isFocusModeChecked, setIsFocusModeChecked] = useState(false);
  const [isDrawScrambleChecked, setIsDrawScrambleChecked] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const darkmode = localStorage.getItem('darkTheme');
    if (darkmode) {
      setIsDarkTheme(JSON.parse(darkmode));
    }
    const settings = localStorage.getItem('settings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setIsFocusModeChecked(parsedSettings.focus);
      setIsInspectionChecked(parsedSettings.inspection);
      setInspectionTime(parsedSettings.inspectionTime);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'settings',
      JSON.stringify({
        focus: isFocusModeChecked,
        inspection: isInspectionChecked,
        inspectionTime: inspectionTime
      })
    );
  }, [isFocusModeChecked, isInspectionChecked, inspectionTime]);
  useEffect(() => {
    focus();
  }, [isFocusModeChecked]);
  const handleChecks = (item) => {
    switch (item.toString()) {
      case 'focusmode':
        setIsFocusModeChecked(!isFocusModeChecked);
        break;
      case 'inspection':
        setIsInspectionChecked(!isInspectionChecked);
        break;
      case 'drawScramble':
        setIsDrawScrambleChecked(!isDrawScrambleChecked);
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      dialogClassName='settingsModal'
      aria-labelledby='settingsModal'
    >
      <Modal.Header className='modalHeader' closeButton>
        <Modal.Title id='settingsModal text-center'>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modalBody d-flex flex-column'>
        <div className='d-flex flex-row justify-content-between'>
          <p>Change Theme</p>
          <select
            className='settingsSelect'
            name='theme'
            value={isDarkTheme}
            onChange={() => {
              changeTheme();
              setIsDarkTheme(!isDarkTheme);
            }}
          >
            <option value={false}>Light</option>
            <option value={true}>Dark</option>
          </select>
        </div>
        <div className='d-flex flex-row justify-content-between'>
          <p>Focus Mode</p>
          <input
            type='checkbox'
            className='settingsCheckbox'
            checked={isFocusModeChecked}
            onChange={() => handleChecks('focusmode')}
          />
        </div>
        <div className='d-flex flex-row justify-content-between'>
          <p>Inspection</p>
          <input
            type='checkbox'
            className='settingsCheckbox'
            checked={isInspectionChecked}
            onChange={() => handleChecks('inspection')}
          />
        </div>
        <div
          className={`${isInspectionChecked ? 'd-flex' : 'd-none'} flew-row justify-content-between`}
        >
          <p>Inspection Timer (seconds)</p>
          <input
            type='number'
            size={3}
            value={inspectionTime}
            onChange={(e) => setInspectionTime(e.target.value)}
          />
        </div>
        <div className='d-flex flex-row justify-content-between'>
          <p>Draw Scramble</p>
          <input
            type='checkbox'
            className='settingsCheckbox'
            checked={isDrawScrambleChecked}
            onChange={() => handleChecks('drawScramble')}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};
