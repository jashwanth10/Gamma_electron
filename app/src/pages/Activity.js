import { useEffect, useState } from "react";
import React from "react";
import radiation_svg from '../svg/nuclear-sign-icon.svg';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setFileData } from "../features/fileDataSlice";
import Dashboard from "../components/dashboard";
import TextBox from "../components/textbox";

const {readCnfFile} = require("../util/cnf_reader");

function Activity() {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);
    const [text, setText] = useState("757905");
    const [weight, setWeight] = useState("");


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleNext = () => {
        navigate('/analysis');
    }
    
    return (
        <div class="flex flex-col justify-center items-center h-screen">
            <div class="text-5xl mb-8">
                Activity
                </div>

                <TextBox
                    placeholder="757905"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    heading={"Live time (s)"}
                />
                <TextBox
                    placeholder="Enter weight..."
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    heading={"Sample Weight (gm)"}
                />
            <Dashboard handlerNext={handleNext}/>
           
        </div>
        

        
    )
}

export default Activity;