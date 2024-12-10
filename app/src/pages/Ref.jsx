import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../components/dashboard";
import DataTable from "../components/DataTable";
import { Processor } from "../util/processor";


function Ref() {
    const [activityPeaksData, setActivityPeaksData] = useState(null);
    const [processor, setProcessor] = useState(null);
    const [activityPeaksTable, setActivityPeaksTable] = useState(null);
    const [activityPeaksForGraph, setActivityPeaksTableForGraph] = useState(null);

    const [peakGraphData, setPeakGraphData] = useState(null);
    const notIncludedPeaks = ["PbKa2 - Fluorescence and 208Tl decay", "BiKa2 - 212 214Pb decay"];


    const navigate = useNavigate();

    const location = useLocation();
    const tableData = location.state?.peakPlotData || [];
    const energies = location.state?.energies || [];
    const channels = location.state?.channels || [];
    const counts = location.state?.counts || [];
    const process = location.state?.processor || null;

    useEffect(() => {
        fetchData();

        const proc = new Processor();
        proc.energies = energies;
        proc.channels = channels;
        proc.counts = counts;
        setProcessor(proc)

        
        // fetch required peaks details;
    }, [])

    useEffect(() => {
        if(processor !== null){
            const u_series = activityPeaksData.filter(x => !notIncludedPeaks.includes(x["name"])).filter(x => x["series"] == "uranium_decay").sort((x,y) => x.name - y.name);
            const k_series = activityPeaksData.filter(x => !notIncludedPeaks.includes(x["name"])).filter(x => x["series"] == "potassium").sort((x,y) => x.name - y.name);
            const th_series = activityPeaksData.filter(x => !notIncludedPeaks.includes(x["name"])).filter(x => x["series"] == "thorium_decay").sort((x,y) => x.name - y.name);
            const nu_series = activityPeaksData.filter(x => !notIncludedPeaks.includes(x["name"])).filter(x => x["series"] == "nuclear").sort((x,y) => x.name - y.name);

            let data = [];
            data.push(processor.activityCalculationStepOne(k_series));
            data.push(processor.activityCalculationStepOne(u_series));
            data.push(processor.activityCalculationStepOne(th_series));
            data.push(processor.activityCalculationStepOne(nu_series));
            const names = data.map(x => x.map(y => y["name"].split("_")[0])).flat();

            processor.activeProfileData = activityPeaksData;
            processor.analyze();
            if(activityPeaksData){
                const det = processor.performPeakAnalysis(activityPeaksData.filter(x => names.includes(x["name"])));
                let graphDet = {};
                setActivityPeaksTableForGraph(det);
                console.log("de ", det);
                det.map(x => {
                    graphDet[x["name"]] = x; 
                })
                setPeakGraphData(graphDet);

            }

            setActivityPeaksTable(data);

        }
    },[activityPeaksData])

    const fetchData = async () => {
        const doc = await window.api.getData("activityPeaksDb", {});
        setActivityPeaksData(doc);
    }

    const handleNext = () => {
        navigate('/metadata', {state: {activityPeaksForGraph}});
    }
    
    return (
        <div class="flex flex-col justify-center items-center h-screen">
            <div class="text-5xl mb-8">
                Intensity values
            </div>
            {activityPeaksTable && <DataTable data={activityPeaksTable} graphData={peakGraphData}/>}
            <Dashboard handlerNext={handleNext}/>
           
        </div>
        

        
    )
}

export default Ref;