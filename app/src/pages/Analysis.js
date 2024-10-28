import React, { useEffect, useState } from "react";
import BackButton from "../components/back-button";
import { useSelector } from "react-redux";
import ZoomableLineGraph from "../components/zoomableLineGrapah";
import { useNavigate, useNavigation } from "react-router-dom";
import { Processor } from "../util/processor";
import ScatterGraph from "../components/scatterGraph";
import ScatterAndLineGraph from "../components/scatterAndLineGraph";
import LineGraph from "../components/lineGraph";
import Dropdown from "../components/dropDown";
import Dashboard from "../components/dashboard";


function Analysis() {

    const activeProfileData = useSelector((state) => state.activeProfileData);

    const fileData = useSelector((state) => state.fileData);

    const navigate = useNavigate();

    const [residualData, setResidualData] = useState(null);
    const [fwhmData, setFwhmData] = useState(null);
    const [refData, setRefData] = useState(null);
    const [fittingData, setFittingData] = useState(null);
    const [dropDownData, setDropDownData] = useState([]);

    const handleNext = () => {
    };

    return (
        <div class="w-full h-[100vh] flex flex-col justify-center items-center">
            <div class="w-full flex justify-center items-center text-5xl mb-4 ">
                Analysis
            </div>
            
            <div class="w-full h-[75vh] max-w-8xl bg-base-200 p-6 rounded-lg flex flex-col justify-center items-center">
                <div class="w-full h-[75vh] bg-base-200 p-6 rounded-lg flex flex-row items-center justify-between">
                    
                        
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                <div class="text-3xl mb-8">
                                    Uranium Series
                                </div>
                                <ScatterGraph />
                        </div>
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                <div class="text-3xl mb-8">
                                    Thorium Series

                                </div>
                                <ScatterGraph />
                        </div>
                </div>
            </div>
            <Dashboard handlerNext={handleNext} showNext={false}/>

            <button 
            onClick={() => {}} 
            className="btn btn-primary z-10"
            >
            
            Compute Activity
            </button>

          
        </div>        
        

    )
}

export default Analysis;