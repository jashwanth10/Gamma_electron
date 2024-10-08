import React, { useState, useEffect } from "react";
import BackButton from "../components/back-button";

const Catalogue = () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [peaks, setPeaks] = useState([]);

    const fetchInitialData = async () => {
        const docs = await window.api.getData("peaksDb", {});
        setPeaks(docs);
    }

    useEffect(() => {
        fetchInitialData();
    }, [])

    const items = [
        { id: 1, name: "Item 1", price: 100 },
        { id: 2, name: "Item 2", price: 150 },
        { id: 3, name: "Item 3", price: 200 },
        { id: 4, name: "Item 4", price: 250 },
        { id: 5, name: "Item 4", price: 250 },
        { id: 6, name: "Item 4", price: 250 },
        { id: 7, name: "Item 4", price: 250 },
        { id: 8, name: "Item 4", price: 250 },

    ];

    // Handle checkbox changes
    const handleSelect = (item) => {
        if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i.name !== item.name)); // Remove item if already selected
        } else {
        setSelectedItems([...selectedItems, item]); // Add item if not selected
        }
    };

    return (
        <div className="container mx-auto p-4">
            <BackButton/>
        <h1 className="text-4xl font-bold text-center mb-8">Catalogue</h1>

        {/* Card container for items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-6">
            {peaks.map((item, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                <h2 className="card-title">{item.name}</h2>
                <p>Energy: {item.energy} keV</p>
                <div className="form-control">
                    <label className="cursor-pointer label">
                    <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        onChange={() => handleSelect(item)}
                        checked={selectedItems.includes(item)}
                    />
                    </label>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* Selected items section */}
        <div className="mt-8">
            <h2 className="text-2xl font-semibold">Selected Items:</h2>
            {selectedItems.length > 0 ? (
            <ul className="list-disc list-inside">
                {selectedItems.map((item, index) => (
                <li key={index} className="my-2">
                    {item.name} - {item.energy} keV
                </li>
                ))}
            </ul>
            ) : (
            <p className="text-gray-500">No items selected.</p>
            )}
        </div>
        </div>
    );
};

export default Catalogue;
