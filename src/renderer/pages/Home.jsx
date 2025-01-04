import { useEffect, useState } from "react";
import React from "react";
import radiation_svg from '../svg/nuclear-sign-icon.svg';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setFileData } from "../features/fileDataSlice";

const {readCnfFile} = require("../util/cnf_reader");

function Home() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
                dispatch(setFileData({ 
                    fileName: selectedFile['name'],
                    channelData: readDic['Channels data'],
                    channels: readDic['Channels'],
                    energy: readDic['Energy'],
                    energyCoefficients: readDic['Energy coefficients'],
                    liveTime: readDic['Live time'],
                    realTime: readDic['Real time'],
                    shapeCoefficients: readDic['Shape coefficients']
                }));
                navigate('/initial-calibration');
            } catch (error) {
                console.error('Error reading file:', error);
            }  
        }
    };

    const handleFileUpload = async () => {
        if (file) {
           
        };

    };

    useEffect(() => {
        if(data){
           
        }
    }, [data])
    
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            
            <img width={250} height={250} style={{padding: '20px'}} src={radiation_svg} />
            <div className="text-5xl mb-8">
                Welcome to Gamma
            </div>
            <div className="text-2xl mb-8">
                Load sample spectrum file (.CNF):
            </div>
            <input type="file" className="file-input file-input-bordered file-input-accent w-full max-w-xs" onChange={handleFileChange}/>
           
        </div>
        

        
    )
}

export default Home;