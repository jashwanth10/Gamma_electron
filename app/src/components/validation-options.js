import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationOptions = ({handlerRevertCoefficients, handlerInteration, handlerRetainCoefficients}) => {
    
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
    <div className="w-full flex justify-center p-4 bg-base-200">
        <div className="dropdown">
            <button 
                onClick={toggleDropdown}
                className="btn m-1"
            >
                Coefficient Optimization
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 ml-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li key={0}><a onClick={() => {
                        handlerRevertCoefficients();
                    }}>Revert to CNF Coefficients</a></li>
                    <li key={1}><a onClick={() => {
                        handlerInteration("One more iteration");

                    }}>One more iteration</a></li>
                    <li key={2}><a onClick={() => {
                        handlerRetainCoefficients("Retain coefficients")
                    }}>Retain coefficients</a></li>
                </ul>
            )}
        </div>
        {/* <div className="space-x-4 flex flex-row">
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerRevertCoefficients()}>Revert to CNF Coefficients</button>
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerInteration()}>One more iteration</button>
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerRetainCoefficients()}>Retain coefficients</button>
        </div> */}
    </div> 
  );
};

export default ValidationOptions;