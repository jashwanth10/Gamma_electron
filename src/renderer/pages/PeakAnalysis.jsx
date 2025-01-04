import { useEffect, useState } from "react";
import React from "react";
import BackButton from "../components/back-button";
import { useSelector } from "react-redux";
import MyLineGraph from "../components/lineGraph";
import ZoomableLineGraph from "../components/zoomableLineGrapah";
import LineGraph from "../components/lineGraph";
import { useNavigate, useNavigation } from "react-router-dom";


function PeakAnalysis() {

    
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0); // State to track current screen

    const toggleOverlay = () => {
        setIsOpen(!isOpen);
        if (isOpen) setCurrentScreen(0); // Reset to the first screen when closing
    };

    const goToNextScreen = () => {
        setCurrentScreen(currentScreen + 1);
    };

    const goToPreviousScreen = () => {
        setCurrentScreen(currentScreen - 1);
    };


    return (
        <div class="flex items-center justify-center min-h-screen">
            <BackButton/>

            <div>
                <button onClick={toggleOverlay} className="btn btn-primary">
                    Open Multi-Screen Overlay
                </button>

                {isOpen && (
                    <div className="w-3/4 max-w-full p-6 rounded-lg flex items-center justify-center z-50">
                    <div className="w-full max-w-full modal modal-open bg-white shadow-lg rounded-lg">
                        <div className="modal-box w-3/4 max-w-full h-[75vh]">
                        {currentScreen === 0 && (
                            <div>
                                <h2 className="text-xl font-bold">Screen 1</h2>
                                <p>This is the first screen.</p>
                                <div className="modal-action">
                                    <button onClick={goToNextScreen} className="btn btn-primary">
                                    Next
                                    </button>
                                </div>
                            </div>
                        )}
                        {currentScreen === 1 && (
                            <div>
                            <h2 className="text-xl font-bold">Screen 2</h2>
                            <p>This is the second screen.</p>
                            <div className="modal-action">
                                <button onClick={goToPreviousScreen} className="btn btn-secondary">
                                Back
                                </button>
                                <button onClick={goToNextScreen} className="btn btn-primary ml-2">
                                Next
                                </button>
                            </div>
                            </div>
                        )}
                        {currentScreen === 2 && (
                            <div>
                            <h2 className="text-xl font-bold">Screen 3</h2>
                            <p>This is the third screen.</p>
                            <div className="modal-action">
                                <button onClick={goToPreviousScreen} className="btn btn-secondary">
                                Back
                                </button>
                                <button onClick={toggleOverlay} className="btn btn-primary ml-2">
                                Close
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                                <button onClick={toggleOverlay} className="absolute top-4 right-4 btn btn-sm btn-circle">
                                    ×
                                </button>
                            </div>
                            </div>
                        )}
            </div>
        </div>

    )
}

export default PeakAnalysis;