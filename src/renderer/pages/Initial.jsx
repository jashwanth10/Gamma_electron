import { useState } from "react";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import LineGraph from "../components/lineGraph";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/dashboard";
import TextBox from "../components/textbox";
import { setSampleData } from "../features/sampleDataSlice";


function Initial() {

    const fileData = useSelector((state) => state.fileData);

    const [weight, setWeight] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();


    const validateInput = (value) => {
        const rationalRegex = /^(0|[1-9]\d*)(\.\d*)?$/;
        if (value === '' || rationalRegex.test(value)) {
          setError("");
          setWeight(value);
        } else {
          setError('Please enter a valid positive rational number.');
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        validateInput(value);
    }

    
    const navigate = useNavigate();

    const handleEnergyValidation = () => {
        if(weight == ""){
            setError("Please enter the sample weight");
        }else{
            dispatch(
                setSampleData({
                    "weight": +weight,
                    "liveTime": fileData["liveTime"],
                    "deadTime": fileData["realTime"]
                })
            );
            
            navigate('/profile');
        }
    }

    const handleUpdate = () => {
        navigate('/catalogue')
    }

    return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-3/4 h-[75vh] bg-base-200 p-6 rounded-lg shadow-lg flex flex-col items-center justify-between">
                    <div className="text-3xl mb-8">
                        Sample Spectrum: {fileData && fileData["fileName"] && fileData["fileName"].split('.')[0]}<br/>
                    </div>
                    <div class="text-1xl mb-8">
                        Live time: {fileData && fileData["liveTime"] && fileData["liveTime"].toFixed(0)} s<br/>
                        Real time: {fileData && fileData["realTime"] && fileData["realTime"].toFixed(0)} s<br/>
                       
                    </div>
                    <TextBox
                            placeholder="Enter weight..."
                            value={weight}
                            onChange={handleChange}
                            heading={"Sample Weight (g)"}
                    />
                    {error && (<p>{error}</p>)}
                    <div className="w-full h-full flex justify-center items-center">
                        {/* <UraniumSeriesChart/> */}
                        <LineGraph data={fileData} xAxis={'energy'} yAxis={'channelData'} xlabel={'Energy (keV)'} ylabel={'Count/Channel'} stepSize={600}/>
                    </div>
                     
                </div>
                <Dashboard handlerNext={handleEnergyValidation}/>
            </div>

    )
}

export default Initial;