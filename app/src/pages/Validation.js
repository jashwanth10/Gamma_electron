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
import ValidationOptions from "../components/validation-options";
import InfoIconWithTooltip from "../components/tooltip";
import MixedChart from "../components/mixedChart";


function Validation() {

    const activeProfileData = useSelector((state) => state.activeProfileData);

    const fileData = useSelector((state) => state.fileData);

    const navigate = useNavigate();

    const [processorObj, setProcessorObj] = useState({});
    const [residualData, setResidualData] = useState(null);
    const [fwhmData, setFwhmData] = useState(null);
    const [refData, setRefData] = useState(null);
    const [fittingData, setFittingData] = useState(null);
    const [dropDownData, setDropDownData] = useState([]);
    const [selectedPeak, setSelectedPeak] = useState([]);
    const [overlayOpen, setOverlayOpen] = useState(false);
    const [peakPlotData, setPeakPlotData] = useState(null);
    const [overlays, setOverlays] = useState(null);
    const [coeffs, setCoeffs] = useState([]);
    const [currentScreen, setCurrentScreen] = useState(0); // State to track current screen

    useEffect(() => {
        setDropDownData(activeProfileData.map((isotope) => isotope.name));
        const processor = new Processor(fileData, activeProfileData);
        processor.analyze();
        console.log(processor);
        const dat = processor.performPeakAnalysis(activeProfileData);
        setPeakPlotData(dat);
        setProcessorObj(processor);
        calculateResidualData(processor);
        calculateFWHMCurve(processor);
        calculateFittingCurve(processor);
    }, [])

    const calculateResidualData = (processor) => {
        const activeProfiles = [...activeProfileData];
        activeProfiles.sort((a,b) => a.energy - b.energy);
        const residuals = activeProfiles.map(isotope => 
            processor.peakCalibration(processor.peaks[isotope["name"] + "_" + isotope["energy"]]) - isotope["energy"]
        );
    
        // x-axis
        const energies = activeProfiles.map(isotope => 
            isotope["energy"]
        );

        const graphData = residuals.map((residual, i) => ({
            x: energies[i],
            y: residual
          }));

          
        setResidualData(graphData);
    }

    const calculateFWHMCurve = (processor) => {
        const activeProfiles = [...activeProfileData];
        activeProfiles.sort((a,b) => a.energy - b.energy);
        // x-axis
        const result = {
            'x': [],
            'y': []
        };

        activeProfiles.forEach(dict => {
            // for (const [key, value] of Object.entries(dict)) {
            //     if (!result[key]) {
            //         result[key] = [];
            //     }
            //     if(key === "energy"){
            //         result["x"].push(+result["energy"]);
            //     }
            //     result[key].push(value);
            // }
            result["x"].push(dict["energy"]);
            result["y"].push(dict["ref"]);
        });

        setRefData(result);

        function getSuffix(key) {
            // Match the numbers at the end of the key
            const match = key.match(/_(\d+).(\d+)$/);
            return match ? parseInt(match[1], 10) : 0; // Extract number or return 0 if no match
        }
        const sorted_fwhm = Object.keys(processor.fwhm)
        .sort((a, b) => getSuffix(a) - getSuffix(b))
        .reduce((acc, key) => {
            acc[key] = processor.fwhm[key];
            return acc; 
        }, {});

        const energies = activeProfiles.map(isotope => 
            isotope["energy"]
        );
        const scatterGraphData = Object.values(sorted_fwhm).map((val, i) => ({
            x: energies[i],
            y: val
        }));
          
        setFwhmData(scatterGraphData);
    }

    const calculateFittingCurve = (processor) => {
        const activeProfiles = [...activeProfileData];
        activeProfiles.sort((a,b) => a.energy - b.energy);
        const energies = activeProfiles.map(isotope => 
            processor.peakCalibration(processor.peaks[isotope["name"] + "_" + isotope["energy"]])
        );
        
        // x-axis
        const peaks = activeProfiles.map(isotope => 
            isotope["name"]
        );
        const graphData = {
            "energies": energies,
            "peaks": peaks 
        }

        const energyAxis = processor.channels.map(x => processor.peakCalibration(x));      
        const countAxis = processor.channels;

        const lineData = energyAxis.map((energy, index) => ({
            'x': countAxis[index],
            'y': energy,
        }));

        const scatterData  = activeProfiles.map((isotope, index) => ({
            'x': processor.peaks[isotope["name"] + "_" + isotope["energy"]],
            'y': isotope["energy"]
        }));

        const graphNewData = {
            "line": lineData,
            "scatter": scatterData
        }
        setFittingData(graphNewData);
    }

    const handleSelectedItem = (dropdownItem) => {
        setSelectedPeak(dropdownItem);
    }


    const toggleOverlay = () => {
        setOverlayOpen(!overlayOpen);
        if (overlayOpen) setCurrentScreen(0); // Reset to the first screen when closing
    };

    const goToNextScreen = () => {
        setCurrentScreen((currentScreen + 1 ) % peakPlotData.length);
    };

    const goToPreviousScreen = () => {
        setCurrentScreen((currentScreen - 1 + peakPlotData.length) % peakPlotData.length);
    };

    const handleAnalyze = () => {
        const dat = processorObj.performPeakAnalysis(activeProfileData);
        setPeakPlotData(dat);
        setOverlayOpen(!overlayOpen);
        let sett = false;
        for(let i = 0; i < dat.length; i++){
            if(dat[i]["name"] == selectedPeak){
                setCurrentScreen(dat[i]["id"])
                sett = true;
                break;
            }
        }
        if (overlayOpen && !sett) setCurrentScreen(0);
    };

    const handleNext = () => {
        const energies = processorObj.energies;
        const counts = processorObj.counts;
        const channels = processorObj.channels;
        navigate('/ref', {state: {peakPlotData, energies, counts, channels}});
    };


    const handlerInteration = () => {
        processorObj.optimizeCoefficients();
        setProcessorObj(processorObj);
        calculateResidualData(processorObj);
        calculateFWHMCurve(processorObj);
        calculateFittingCurve(processorObj);
    }
    
    return (
        <div class="w-full h-[100vh] flex flex-col justify-center items-center">
            <div class="w-full flex justify-center items-center text-5xl mb-4 ">
                Energy Validation Control
            </div>
            <div class="w-full h-[75vh] max-w-8xl bg-base-200 p-6 rounded-lg flex flex-col justify-center items-center">
                <div className="w-full max-w-full flex flex-row rounded-lg p-4 bg-base-200 ">
                    <div className="flex w-1/4">
                        <Dropdown data={dropDownData} selectedItemDropDown={handleSelectedItem}/>
                    </div>
                    <div className="w-3/4 flex justify-end">
                        <button className="btn btn-primary m-2" onClick={handleAnalyze}>Analyze</button>
                        <button className="btn btn-primary m-2">Add Peak</button>
                    </div>
                </div>
                <div class="w-full h-[75vh] bg-base-200 p-6 rounded-lg flex flex-row items-center justify-between">
                    <div class="w-full h-full flex flex-col justify-center items-center">
                        <div class="text-3xl mb-8">
                                Energy Calibraation
                            </div>
                            {fittingData && (<MixedChart lineData={fittingData["line"]} scatterData={fittingData["scatter"]}/>)}
                    </div>
                    <div class="w-full h-full flex flex-col justify-center items-center">
                        
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                <div class="text-3xl mb-8">
                                </div>
                                <ScatterGraph data={residualData} xlabel={'Energy (keV)'} ylabel={'Residual (keV)'}/>
                                 <InfoIconWithTooltip chart={"residual"}/>

                        </div>
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                <div class="text-3xl mb-8">
                                </div>
                                {refData && fwhmData && (
                                    <ScatterAndLineGraph data1={refData} data2={fwhmData} xlabel={'Energy (keV)'} ylabel={'FWHM (keV)'}/>
                                
                                )}
                                    <InfoIconWithTooltip chart={"FWHM"}/>

                        </div>
                    </div>  
                </div>
            </div>
            {overlayOpen && (
                        <div className="w-3/4 max-w-full p-6 rounded-lg flex items-center justify-center z-50">
                        <div className="w-full max-w-full modal modal-open bg-white shadow-lg rounded-lg">
                            <div className="modal-box w-3/4 max-w-full">
                                    <div className="w-full h-[75vh] modal-action flex flex-col items-center justify-center">
                                        <div class="text-5xl mb-8">
                                            {peakPlotData[currentScreen]["name"].split("_")[0].split("-")[1] + peakPlotData[currentScreen]["name"].split("-")[0].split("_")[0] + " (" + peakPlotData[currentScreen]["name"].split("_")[1] + "keV)"}
                                        </div>
                                        <LineGraph radius={0} xlabel={'Energy (keV)'} ylabel={'Counts'} datasets={peakPlotData[currentScreen]["plotData"]} labels={peakPlotData[currentScreen]["labels"]}/>
                                        <div class="text-3xl mb-8">
                                            Peak Intensity = {Math.abs(peakPlotData[currentScreen]["intensity"].toFixed(0))} +/- {peakPlotData[currentScreen]["sigma"].toFixed(0)}
                                        </div>
                                        <div className="flex flex-row space-x-12">
                                            <button onClick={goToPreviousScreen} className="btn btn-primary">
                                            Prev
                                            </button>
                                            <button onClick={goToNextScreen} className="btn btn-primary">
                                            Next
                                            </button>
                                        </div>
                                        
                                    </div>
                            </div>
                                    <button onClick={toggleOverlay} className="absolute top-4 right-4 btn btn-sm btn-circle">
                                        ×
                                    </button>
                                </div>
                                </div>
            )}
            <ValidationOptions handlerInteration={handlerInteration}/>
            <Dashboard handlerNext={handleNext}/>
            
        </div>        
        

    )
}

export default Validation;