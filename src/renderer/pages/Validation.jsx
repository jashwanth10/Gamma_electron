import React, { useEffect, useState } from "react";
import BackButton from "../components/back-button";
import { useDispatch, useSelector } from "react-redux";
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
import { setSampleData } from "../features/sampleDataSlice";


function Validation() {

    const activeProfileData = useSelector((state) => state.activeProfileData);
    const sampleData = useSelector((state) => state.sampleData);
    const fileData = useSelector((state) => state.fileData);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
    const [coeffs, setCoeffs] = useState(fileData.energyCoefficients);
    const [currentScreen, setCurrentScreen] = useState(0); 
    const [saveCoeffs, setSaveCoeffs] = useState(true);

    const notIncludedResidualPeaks = ["241Am_59.5409", "137Cs_661.657", "228Ac_968.971", "228Ac_129.07", "230Th_67.672"];
    useEffect(() => {
        setDropDownData(activeProfileData.map((isotope) => isotope.name + " (" + isotope.energy + " keV)"));
        if(sampleData.energyCoefficients.length > 0){
            setCoeffs(sampleData.energyCoefficients);
        }else{
            setCoeffs(fileData.energyCoefficients);
        }
        const processor = new Processor(sampleData.energyCoefficients.length == 0 ? fileData.energyCoefficients : sampleData.energyCoefficients, fileData, activeProfileData);
        processor.analyze();
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
        const residuals = activeProfiles.filter(isotope => !notIncludedResidualPeaks.includes(isotope["name"]+ "_" + isotope["energy"])).map(isotope => processor.peakCalibration(processor.peaks[isotope["name"]+ "_" + isotope["energy"]]) - +isotope["energy"] );
    
        // x-axis
        const energies = activeProfiles.map(isotope => 
            notIncludedResidualPeaks.includes(isotope["name"] + "_" + isotope["energy"]) ? null : isotope["energy"] 
        ).filter(x => x != null);

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
        function getSuffix(key) {
            // Match the numbers at the end of the key
            return +key.split("_")[1]
            const match = key.match(/_(\d+).(\d+)$/);
            return match ? parseInt(match[1], 10) : 0; // Extract number or return 0 if no match
        }
        const interestPeaks = [46.539, 63.29, 238.632, 295.2228, 338.32, 351.9321, 609.32, 911.204, 1120.294, 1460.822]
        const sorted_fwhm = Object.keys(processor.fwhm)
        .sort((a, b) => getSuffix(a) - getSuffix(b))
        .reduce((acc, key) => {
            acc[key] = processor.fwhm[key];
            return acc; 
        }, {});
        const energies = activeProfiles.map(isotope => 
            isotope["energy"]
        );
       
        const scatterData = activeProfileData.map((val, i) => {
            if(interestPeaks.includes(+val["energy"])){
                return {
                    'x': +val["energy"],
                    'y': sorted_fwhm[val["name"] + "_" + val["energy"]]
                }
            }
        })
        .filter(x => x !== undefined);

        const lineData = processor.getRefCurveData()
        const fwhmGraphNewData = {
            "line": lineData,
            "scatter": scatterData
        }
          
        setFwhmData(fwhmGraphNewData);
    }

    const calculateFittingCurve = (processor) => {
        const activeProfiles = [...activeProfileData];
        activeProfiles.sort((a,b) => a.energy - b.energy);
        
        // x-axis
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
            const isotope_name = selectedPeak.split("(")[0].trim();
            const isotope_energy = selectedPeak.split("(")[1].split("keV")[0].trim();
            if(dat[i]["name"] == isotope_name + "_" + isotope_energy){
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
        setCoeffs(sampleData.energyCoefficients);
        navigate('/ref', {state: {peakPlotData, energies, counts, channels, processorObj}});
    };

    const handleRetainCoeffs = () => {
        setSaveCoeffs(true);
        dispatch(
            setSampleData({
                ...sampleData,
                "energyCoefficients": coeffs
            })
        )
    }

    const handleRevertCoeffs = () => {
        setSaveCoeffs(false);
        dispatch(
            setSampleData({
                ...sampleData,
                "energyCoefficients": fileData.energyCoefficients
            })
        )
        setCoeffs(fileData.energyCoefficients);
        processorObj.setEnergyCoefficients(fileData.energyCoefficients);
        calculateResidualData(processorObj);
        calculateFWHMCurve(processorObj);
        calculateFittingCurve(processorObj);
    }

    const handlerIteration = () => {
        setSaveCoeffs(false);
        const energyCoeffs = processorObj.optimizeCoefficients(activeProfileData);
        setCoeffs(energyCoeffs);
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
            {/* <div class="w-full h-[75vh] max-w-8xl bg-base-200 p-6 rounded-lg flex flex-col justify-center items-center"> */}
                <div className="w-full flex flex-row rounded-lg p-4 bg-base-200 ">
                    <div className="flex w-1/4">
                        <ValidationOptions handlerIteration={handlerIteration} handlerRetainCoefficients={handleRetainCoeffs} handlerRevertCoefficients={handleRevertCoeffs}/>
                    </div>
                    <div className="w-3/4 flex justify-end">
                        <Dropdown data={dropDownData} selectedItemDropDown={handleSelectedItem}/>
                        <button className="btn btn-primary m-2" onClick={handleAnalyze}>Analyze</button>
                        <button className="btn btn-primary m-2">Add Peak</button>
                    </div>
                </div>
                <div class="w-full h-[75vh] bg-base-200 p-6 rounded-lg flex flex-row items-center justify-between ">
                    <div class="w-full h-full flex flex-col justify-center items-center">
                            <div class="text-3xl mb-8">
                                Energy Calibration
                            </div>
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                            {fittingData && (<MixedChart lineData={fittingData["line"]} scatterData={fittingData["scatter"]} name="energy-reference-chart"/>)}
                        </div>
                        <div >
                            <div className="text-xl mb-4">
                                Energy Coefficients: E(x) = A2.x² + A1.x + A0
                            </div>
                            {!saveCoeffs && (
                                <div className="mb-2 text-red-300">
                                Please Click on "Retain Coefficients" to save the following coefficients.
                              </div>
                            )}
                            {/* {sampleData.energyCoefficients.length > 0 ? ( */}
                                <div>
                                    <div>A0: {coeffs[0]}</div>
                                    <div>A1: {coeffs[1]}</div>
                                    <div>A2: {coeffs[2]}</div>
                                </div>
                            {/* ) : (
                                <div>
                                    <div>A0: {fileData.energyCoefficients[0]}</div>
                                    <div>A1: {fileData.energyCoefficients[1]}</div>
                                    <div>A2: {fileData.energyCoefficients[2]}</div>
                                </div>
                            )} */}
                            
                        </div>
                    </div>
                    <div class="w-full h-full flex flex-col justify-center items-center">
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                {residualData && (<ScatterGraph data={residualData} xlabel={'Energy (keV)'} ylabel={'Residual (keV)'} name="residual-plot"/>)}
                                 <InfoIconWithTooltip chart={"residual"}/>

                        </div>
                        <div class="w-full h-full flex flex-col justify-center items-center ">
                                {fwhmData && (
                                    <MixedChart lineData={fwhmData["line"]} scatterData={fwhmData["scatter"]} xlabel="Energy (keV)" ylabel="FWHM (keV)" name="fwhm-chart"/>
                                
                                )}
                                    <InfoIconWithTooltip chart={"FWHM"}/>
                        </div>
                    </div>  
                </div>
            {/* </div> */}
            {overlayOpen && (
                        <div className="w-3/4 max-w-full p-6 rounded-lg flex items-center justify-center z-50">
                        <div className="w-full max-w-full modal modal-open bg-white shadow-lg rounded-lg">
                            <div className="modal-box w-3/4 max-w-full">
                                    <div className="w-full h-[75vh] modal-action flex flex-col items-center justify-center">
                                        <div class="text-5xl mb-8">
                                            {peakPlotData[currentScreen]["name"].split("-")[0].split("_")[0] + " (" + peakPlotData[currentScreen]["name"].split("_")[1] + "keV)"}
                                        </div>
                                        <LineGraph radius={0} xlabel={'Energy (keV)'} ylabel={'Counts'} datasets={peakPlotData[currentScreen]["plotData"]} labels={peakPlotData[currentScreen]["labels"]}/>
                                        <div class="text-3xl mb-8">
                                            Peak Intensity = {Math.abs(peakPlotData[currentScreen]["intensity"].toFixed(0))} ± {peakPlotData[currentScreen]["sigma"].toFixed(0)}
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
            <Dashboard handlerNext={handleNext}/>
            
        </div>        
        

    )
}

export default Validation;