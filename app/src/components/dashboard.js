import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({handlerNext}) => {
  const navigate = useNavigate();

  const handlePrev = () => {
    // Navigate back within React Router
    navigate(-1);

    // Optionally send an IPC message to Electron to handle webContents navigation
    // ipcRenderer.send('go-back');
  };

  const handleNext = () => {
    // Navigate back within React Router
    navigate(1);

    // Optionally send an IPC message to Electron to handle webContents navigation
    // ipcRenderer.send('go-back');
  };

  return (
    <div className="left-0 w-full flex justify-center p-4 bg-base-100">
        <div className="space-x-4">
            <button className="btn btn-primary z-10" onClick={handlePrev}>Prev</button>
            <button className="btn btn-primary z-10" onClick={() => handlerNext()}>next</button>
        </div>
    </div> 
  );
};

export default Dashboard;