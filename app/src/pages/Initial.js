import { useEffect, useState } from "react";
import React from "react";
import BackButton from "../components/back-button";
import { useSelector } from "react-redux";
import MyLineGraph from "../components/lineGraph";
import ZoomableLineGraph from "../components/zoomableLineGrapah";
import LineGraph from "../components/lineGraph";
import { useNavigate, useNavigation } from "react-router-dom";
import Dashboard from "../components/dashboard";


function Initial() {

    const fileData = useSelector((state) => state.fileData);
    
    const navigate = useNavigate();

    const handleEnergyValidation = () => {
        navigate('/profile')
    }

    const handleUpdate = () => {
        navigate('/catalogue')
    }

    return (
            <div class="flex flex-col items-center justify-center min-h-screen">
                <BackButton/>

                <div class="w-3/4 h-[75vh] bg-base-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
                    <div class="text-3xl mb-8">
                        Sample Spectrum: {fileData && fileData["fileName"] && fileData["fileName"].split('.')[0]}<br/>
                    </div>
                    <div class="text-1xl mb-8">
                        Live time: {fileData && fileData["liveTime"] && fileData["liveTime"].toFixed(2)} s<br/>
                        Real time: {fileData && fileData["realTime"] && fileData["realTime"].toFixed(2)} s<br/>
                    </div>
                    <div class="w-full h-full flex justify-center items-center">
                        <LineGraph data={fileData} xAxis={'energy'} yAxis={'channelData'} xlabel={'Energy (keV)'} ylabel={'Count/Channel'} stepSize={600}/>
                    </div>
                     
                </div>
                <Dashboard handlerNext={handleEnergyValidation}/>
            </div>

    )
}

export default Initial;