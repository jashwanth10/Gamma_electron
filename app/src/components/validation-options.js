import React from 'react';
import { useNavigate } from 'react-router-dom';

const ValidationOptions = ({handlerRevertCoefficients, handlerInteration, handlerRetainCoefficients}) => {

    return (
    <div className="left-0 w-full flex justify-center p-4 bg-base-100">
        <div className="space-x-4">
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerRevertCoefficients()}>Revert to CNF Coefficients</button>
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerInteration()}>One more iteration</button>
            <button className="btn btn-outline btn-accent z-10" onClick={() => handlerRetainCoefficients()}>Retain coefficients</button>
        </div>
    </div> 
  );
};

export default ValidationOptions;