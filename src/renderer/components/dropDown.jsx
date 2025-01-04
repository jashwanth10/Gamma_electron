import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Dropdown = ({data, selectedItemDropDown}) => {

  const [selectedItem, setSelectedItem] = useState('Select a peak'); // State to track the selected item
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility
  // Function to handle selecting an item
  const handleSelect = (item) => {
    setSelectedItem(item);
    toggleDropdown(); // Update the selected item in state
    selectedItemDropDown(item);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="space-x-12">

        <div className="dropdown">
            <button 
                onClick={toggleDropdown}
                className="btn m-2"
            >
                {selectedItem} 
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 ml-2"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>
            {isOpen && (
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-lg bg-white z-50 rounded-box w-52">
                    {data.length > 0 && data.map((item, index) => (
                        <li key={index}><a onClick={() => handleSelect(item)}>{item}</a></li>
                    ))}
                </ul>
            )}
            
        </div>
    </div>
   
  );
};

export default Dropdown;