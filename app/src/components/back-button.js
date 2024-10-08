import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate back within React Router
    navigate(-1);

    // Optionally send an IPC message to Electron to handle webContents navigation
    // ipcRenderer.send('go-back');
  };

  return (
    <button 
      onClick={handleBack} 
      className="btn btn-primary fixed top-4 left-4 z-10"
    >
      Back
    </button>
  );
};

export default BackButton;