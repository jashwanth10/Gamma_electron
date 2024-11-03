import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Dashboard from "../components/dashboard";
import DataTable from "../components/DataTable";
import { Processor } from "../util/processor";

const {readCnfFile} = require("../util/cnf_reader");

function Ref() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [activityPeaksData, setActivityPeaksData] = useState(null);
    const [processor, setProcessor] = useState(null);
    const [activityPeaksTable, setActivityPeaksTable] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const tableData = location.state?.peakPlotData || [];
    const energies = location.state?.energies || [];
    const channels = location.state?.channels || [];
    const counts = location.state?.counts || [];

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
            const data = processor.activityCalculationStepOne(activityPeaksData);
            console.log(tableData);
            console.log(data);
            setActivityPeaksTable(data);
        }
    },[activityPeaksData])

    const fetchData = async () => {
        const doc = await window.api.getData("activityPeaksDb", {});
        setActivityPeaksData(doc);
    }

    const handleNext = () => {
        
        navigate('/analysis');
    }

    
    return (
        <div class="flex flex-col justify-center items-center h-screen">
            <div class="text-5xl mb-8">
                Intensity values
            </div>
            {activityPeaksTable && <DataTable data={activityPeaksTable} />}
            <Dashboard handlerNext={handleNext}/>
           
        </div>
        

        
    )
}

export default Ref;