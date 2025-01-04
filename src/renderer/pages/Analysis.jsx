import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../components/dashboard";
import { ActivityProcessor } from "../util/activity_processor";
import SeriesGraph from "../components/seriesGraph";


function Analysis() {
    const navigate = useNavigate();
    const location = useLocation();
    const sampleData = useSelector((state) => state.sampleData);
    const intensityData = location.state?.activityPeaksForGraph || [];
    
    const [csvData, setCsvData] = useState([]);
    const csvFiles = ["background",  "efficiency", "countRate", "efficiencySecondary", "emissionRate"]


    const U1s_1 = [
        {x: 0, y: 24.4},
        {x: 1500, y: 24.4} 
    ]
    const U1s_2 = [
        {x: 0, y: 23.7},
        {x: 1500, y: 23.7} 
    ]
    const U1s = [U1s_1, U1s_2];

    const U2s_1 = [
        {x: 0, y: 24.7},
        {x: 1500, y: 24.7} 
    ]
    const U2s_2 = [
        {x: 0, y: 23.4},
        {x: 1500, y: 23.4} 
    ]
    const U2s = [U2s_1, U2s_2];

    const U238_1 = [
        {x: 0, y: 30.2},
        {x: 1500, y: 30.2} 
    ]
    const U238_2 = [
        {x: 0, y: 22.2},
        {x: 1500, y: 22.2} 
    ]
    const U238 = [U238_1, U238_2];

    const Ra226_1 = [
        {x: 0, y: 34.2},
        {x: 1500, y: 34.2} 
    ]
    const Ra226_2 = [
        {x: 0, y: 18.3},
        {x: 1500, y: 18.3} 
    ]
    const Ra226 = [Ra226_1, Ra226_2];

    const uLineData = [U1s, U2s, U238, Ra226];

    const Th1s_1 = [
        {x: 0, y: 52.5},
        {x: 1500, y: 52.5} 
    ]
    const Th1s_2 = [
        {x: 0, y: 51.6},
        {x: 1500, y: 51.6} 
    ]
    const Th1s = [Th1s_1, Th1s_2];

    const Th2s_1 = [
        {x: 0, y: 52.9},
        {x: 1500, y: 52.9} 
    ]
    const Th2s_2 = [
        {x: 0, y: 51.1},
        {x: 1500, y: 51.1} 
    ]
    const Th2s = [Th2s_1, Th2s_2];

    const Ac228_1 = [
        {x: 0, y: 52.9},
        {x: 1500, y: 52.9} 
    ]
    const Ra224_1 = [
        {x: 0, y: 51.7},
        {x: 1500, y: 51.7} 
    ]
    const Th = [Ac228_1, Ra224_1];

    const thLineData = [Th1s, Th2s, Th];

    const [graphU, setGraphU] = useState([]);
    const [graphTh, setGraphTh] = useState([]);
    const [finalData, setFinalData] = useState(null);

    const refactorCsvData = (data) =>{
        const rows = data.split("\n").map((row) => row.split(","));
        let refactoredData = {};
        for(const [index, row] of rows.entries()){
            if(index == 0) continue;
          refactoredData[row[0] + "_" + row[1]] = [Number(row[2]), Number(row[3])];
        }
        return refactoredData;
    }

    useEffect(() => {
        const loadData = async () => {
            
            const csvd = loadCsvData();  // Ensure csvData is set before proceeding
    
            csvd.then((csvData) => {
                let refactoredCsvData = {};
                for(let i=0;i<csvData.length;i++){
                    refactoredCsvData[csvFiles[i]] = refactorCsvData(csvData[i]);
                }
                const activityProcessor = new ActivityProcessor(sampleData, intensityData, refactoredCsvData);
                const data = activityProcessor.analyze();
                const graphU = activityProcessor.getUraniumSeriesGraph();
                const graphTh = activityProcessor.getThoriumSeriesGraph();
        
                // Set the final data and graph outputs
                setFinalData(data);
                setGraphU(graphU);
                setGraphTh(graphTh);
            }).catch((error) => {
                console.error("Error faced while calculating data: ", error);
            })
            // Proceed with ActivityProcessor after csvData is loaded
        };
    
        loadData(); 
    }, [])

    const loadCsvData = async () => {
        try {
          // Read the CSV file
          const data = await window.api.fetchCsvData();
          return data;
        } catch (error) {
          console.error("Error reading CSV file:", error);
        }
      };

    const handleNext = () => {
        navigate('/results', {state: {finalData}})
    };

    return (
        <div class="w-full h-[100vh] flex flex-col justify-center items-center">
            <div class="w-full flex justify-center items-center text-5xl mb-4 ">
            </div>
            
            <div class="w-full h-[75vh] max-w-8xl bg-base-200 p-6 rounded-lg flex flex-col justify-center items-center">
                <div class="w-full h-[75vh] bg-base-200 p-6 rounded-lg flex flex-col items-center justify-between">
                    
                        
                        <div class="w-full h-full flex flex-row justify-center items-center ">
                                <div class="text-3xl mb-8">
                                    Uranium Decay Series
                                    {graphU && <SeriesGraph scatterData={graphU} lineData={uLineData}/>}

                                </div>
                                {finalData && (<table className="table table-zebra w-1/2">
                                    <thead>
                                    <tr>
                                        <th className="text-left text-3xl"></th>
                                        <th className="text-left text-3xl">²³⁸U</th>
                                        <th className="text-left text-3xl">²²⁶Ra</th>
                                        <th className="text-left text-3xl">²¹⁰Pb</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr key={1}>
                                                <th>Activity</th>
                                                <td>{finalData[0]["238U"][0].toFixed(2)} ± {finalData[0]["238U"][1].toFixed(2)}</td>
                                                <td>{finalData[0]["226Ra"][0].toFixed(2)} ± {finalData[0]["226Ra"][1].toFixed(2)}</td>
                                                <td>{finalData[0]["210Pb"][0].toFixed(2)} ± {finalData[0]["210Pb"][1].toFixed(2)}</td>
                                            </tr>
                                        
                                    </tbody>
                                </table>)}
                        </div>
                        <div class="w-full h-full flex flex-row justify-center items-center ">
                                <div class="text-3xl mb-8">
                                    Thorium Decay Series
                                    {graphTh && <SeriesGraph scatterData={graphTh} lineData={thLineData}/>}

                                </div>
                                {finalData && (<table className="table table-zebra w-1/2 ">
                                    <thead>
                                    <tr>
                                        <th className="text-left text-3xl"></th>
                                        <th className="text-left text-3xl">²³²Th</th>
                                        <th className="text-left text-3xl">⁴⁰K</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr key={1}>
                                                <th>Activity</th>
                                                <td>{finalData[0]["232Th"][0].toFixed(2)} ± {finalData[0]["232Th"][1].toFixed(2)}</td>
                                                <td>{finalData[0]["40K"][0].toFixed(2)} ± {finalData[0]["40K"][1].toFixed(2)}</td>
                                            </tr>
                                        
                                    </tbody>
                                </table>)}

                        </div>
                </div>
            </div>
            <Dashboard handlerNext={handleNext} showNext={false}/>

            <button 
            onClick={handleNext} 
            className="btn btn-primary z-10"
            >
            
            Show results
            </button>

          
        </div>        
        

    )
}

export default Analysis;