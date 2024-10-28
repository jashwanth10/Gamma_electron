import { useEffect, useState } from "react";
import React from "react";
import radiation_svg from '../svg/nuclear-sign-icon.svg';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setFileData } from "../features/fileDataSlice";
import Dashboard from "../components/dashboard";
import DataTable from "../components/DataTable";

const {readCnfFile} = require("../util/cnf_reader");

function Ref() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const tableData = location.state?.peakPlotData || [];
    console.log(tableData);

    const users = [
        { id: 1, name: 'Alice', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Bob', role: 'User', status: 'Inactive' },
        { id: 3, name: 'Charlie', role: 'Manager', status: 'Active' },
      ];

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            
            setFile(selectedFile);
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                // Process CNF file details
                const { readDic, nameWithDate } = await readCnfFile(selectedFile, false);
                setData(readDic);
                
                // Set file data in redux and navigate
               
            } catch (error) {
                console.error('Error reading file:', error);
            }  
        }
    };

    const handleNext = () => {
        navigate('/analysis');
    }

    
    return (
        <div class="flex flex-col justify-center items-center h-screen">
            <div class="text-5xl mb-8">
                Intensity values
            </div>
            <DataTable data={tableData} />
            <Dashboard handlerNext={handleNext}/>
           
        </div>
        

        
    )
}

export default Ref;