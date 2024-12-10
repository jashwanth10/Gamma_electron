import { useEffect, useState } from "react";
import React from "react";
import BackButton from "../components/back-button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveProfile } from "../features/activeProfileDataSlice";

function Profile() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [profileData, setProfileData] = useState(null);
    const [profileName, setProfileName] = useState(null);
    const [formActive, setFormActive] = useState(false);
    const [peaksAdded, setPeaksAdded] = useState([]);
    const [newProfilePeaks, setNewProfilePeaks] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        energy: '',
        ref: '',
        limit_BE_Rpic_left: '',
        limit_BE_Rpic_right: '',
        limit_HE_Rpic_left: '',
        limit_HE_Rpic_right: '',
        nb_canaux_BFBE: '',
        nb_canaux_BFHE: '',
        larger_region_pic: '',
        range: ''
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData({
          ...formData,
          [id]: value
        });
    };

    useEffect(() => {
        fetchInitialData();
    }, [])

    useEffect(() => {
        fetchInitialData();
    }, [formActive])

    const fetchInitialData = async () => {
        const docs = await window.api.getData("profilesDb", {});
        setProfileData(docs);
    }

    const handleChooseProfile = async (name) => {
        try {
            const doc = await window.api.getData("profilesDb", {"profile_name": name});
            dispatch(setActiveProfile(doc[0].peaks));
            navigate('/Validation')
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    };

    const insertNewProfile = () => {
        // setFormActive(true);
        navigate('/Catalogue');
    }

    const handleAnotherPeak = () => {
        setPeaksAdded([...peaksAdded, formData.name]);
        setNewProfilePeaks([...newProfilePeaks, formData]);
    }
    
    const handleProfileNameChange = (event) => {
        const {id, value} = event.target
        setProfileName(value);
    }

    const handleSubmit = async () => {
        try {
            const doc = await window.api.insertData("profilesDb",{"profile_name": profileName, "peaks": newProfilePeaks});
            setFormActive(false);
            setProfileName(null);
            const doc1 = await window.api.insertData("peaksDb", [...newProfilePeaks]);
            
            // Fetch updated data only if necessary
        } catch (error) {
            console.error('Error inserting data:', error);
        }

    };

    return (

        <div className="flex flex-col items-center justify-center h-screen p-4">
            <BackButton/>
            {!formActive && (
                <div className="text-4xl font-bold mb-4">Choose a Profile:</div>
            )}
            {!formActive && (
                <div className="text-2xl mb-6">Each profile contains a set of peaks of interest to be calibrated against</div>
            )}
            {formActive && (
                <input 
                    type="text" 
                    id="profileName"
                    className="input input-bordered w-full gap-4" 
                    value={profileName}
                    onChange={handleProfileNameChange}
                    placeholder="Profile Name"
                />
            )}
            {formActive && (
                
                <div className="text-2xl mb-6">Add Peak Details</div>

            )}
            {formActive && (
                <div className="text-xl mb-6">Peaks added: </div>
                
                
            )}
             {formActive && (
                <div className="flex flex-wrap gap-4 mb-6">
                    {peaksAdded.length > 0 && peaksAdded.map((item, index) => (
                        <p key={index} className="text-lg">{item}</p>
                    ))}
                </div>
            )}
           
            <div className={`flex ${formActive ? 'w-1/2' : 'w-full'} max-w-4xl space-x-4`}>
                {!formActive && (
                    <div className="flex-1 p-4 rounded-lg text-center text-white">
                        <div className="flex grid grid-cols-3 gap-4 bg-base-100 p-6 rounded-lg shadow-lg">
                            {profileData && profileData.map((item, index) => (
                                <button className="btn btn-primary" onClick={() => handleChooseProfile(item.profile_name)}>{item.profile_name}</button>
                            ))}
                            <button className="btn btn-primary" onClick={insertNewProfile}>Add ...</button>
                            
                        </div>
                    </div>
                )}

            </div>
           
            
        </div>

    )
}

export default Profile;