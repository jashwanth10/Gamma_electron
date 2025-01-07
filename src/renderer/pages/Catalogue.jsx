import React, { useState, useEffect } from "react";
import BackButton from "../components/back-button";
import { useNavigate } from "react-router-dom";

const Catalogue = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [peaks, setPeaks] = useState([]);
    const [error, setError] = useState(null);
    const [profileName, setProfileName] = useState("");
    const navigate = useNavigate();


    const fetchInitialData = async () => {
        const docs = await window.api.getData("activityPeaksDb", {});
        setPeaks(docs);
    }

    useEffect(() => {
        fetchInitialData();
    }, [])

    // const items = [
    //     { id: 1, name: "Item 1", price: 100 },
    //     { id: 2, name: "Item 2", price: 150 },
    //     { id: 3, name: "Item 3", price: 200 },
    //     { id: 4, name: "Item 4", price: 250 },
    //     { id: 5, name: "Item 4", price: 250 },
    //     { id: 6, name: "Item 4", price: 250 },
    //     { id: 7, name: "Item 4", price: 250 },
    //     { id: 8, name: "Item 4", price: 250 },

    // ];


    // Handle checkbox changes
    const handleSelect = (item) => {
        if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i.name + i.energy !== item.name + item.energy)); // Remove item if already selected
        } else {
        setSelectedItems([...selectedItems, item]); // Add item if not selected
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleSubmit = async () => {
        if(profileName == null ){
            setError("Please enter valid name");
            return;
        } 
        if(selectedItems.length == 0) {
            setError("Please select atleast one peak");
            return;
        }
        try {
            setError(null);
            const doc = await window.api.insertData("profilesDb",{"profile_name": profileName, "peaks": selectedItems});
            alert("New Profile: " + profileName + " created!")
            sleep(2000).then(() => {
                navigate('/profile');
            })
            // Fetch updated data only if necessary
        } catch (error) {
            console.error('Error inserting data:', error);
        }

    };

    const handleInputChange = (event) => {
        const name = event.target.value;
        setProfileName(name);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <BackButton/>
            <h1 className="text-4xl font-bold text-center mb-8">Create Profile</h1>

            <div className="flex w-full h-[75vh] relative">
                {/* Left half - scrollable */}
                <div className="w-1/2 overflow-y-auto bg-gray-100 p-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Catalogue</h2>

                    {/* Card container for items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {peaks.sort((a,b) => a.energy - b.energy).map((item, index) => (
                        <div key={index} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                            <h2 className="card-title">{item.name}</h2>
                            <p>Energy: {item.energy} keV</p>
                            <div className="form-control">
                                <label className="cursor-pointer label">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    value={profileName}
                                    onChange={() => handleSelect(item)}
                                    checked={selectedItems.includes(item)}
                                />
                                </label>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
                
                {/* Right half - fixed */}
                <div className="w-1/2 fixed right-0 h-[75vh] bg-gray-200 p-4">
                    {/* Selected items section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold">Selected Isotopes:</h2>
                        {selectedItems.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {selectedItems.map((item, index) => (
                            <li key={index} className="my-2">
                                {item.name} - {item.energy} keV
                            </li>
                            ))}
                        </ul>
                        ) : (
                        <p className="text-gray-500">No Isotopes selected.</p>
                        )}
                        
                    </div>
                </div>
            </div>
            
            <div className="space-x-4 p-8 flex items-center justify-center">
                    <input 
                        type="text" 
                        id="name"
                        className="input input-bordered w-[35vh] gap-4" 
                        value={profileName}
                        onChange={handleInputChange}
                        placeholder="Profile Name"
                    />
                    <button class="btn btn-outline btn-success" onClick={handleSubmit}>Create</button>
            </div>
            {error && (<p className="text-color-500">{error}</p>)}

        </div>
    );
};

export default Catalogue;
