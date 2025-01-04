import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../components/dashboard";

function Metadata() {
  const navigate = useNavigate();
  const location = useLocation();
  const activityPeaksForGraph = location.state?.activityPeaksForGraph || [];
  
  const [fileData, setFileData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [csvPath, setCsvPath] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [csvData, setCsvData] = useState({
    background: null,
    countRate: null,
    efficiency: null,
    efficiencySecondary: null,
    emissionRate: null
  });

  const flashcards = [
    { title: "Background spectra", csvPath: "background.csv", field: "background" },
    { title: "Efficiency", csvPath: "efficiency.csv", field: "efficiency" },
    { title: "Count Rate", csvPath: "count_rate.csv", field: "countRate" },
    { title: "Efficiency (secondary)", csvPath: "efficiency_v2.csv", field: "efficiencySecondary" },
    { title: "Emission Rate", csvPath: "emission_rate.csv", field: "emissionRate" },

  ];

  const loadCsvFile = async (path) => {
    try {
      // Get the path of the CSV file
      if(path == null){
        const path = "meta/sample.csv";
      }
      setCsvPath(path);

      // Read the CSV file
      const data = await window.api.readCsv(path);
      const rows = data.split("\n").map((row) => row.split(","));
      setHeaders(rows[0]);
      setFileData(rows.slice(1));
    } catch (error) {
      console.error("Error reading CSV file:", error);
    }
  };


  const handleEdit = (rowIndex, cellIndex, value) => {
    if(validateInput(value)){
      const updatedData = [...fileData];
      updatedData[rowIndex][cellIndex] = value;
      setFileData(updatedData);
    }
    
  };

  const handleSave = () => {
    const updatedCsv = [headers, ...fileData]
      .map((row) => row.join(","))
      .join("\n");

    try {
      window.api.writeCsv(csvPath, updatedCsv);
      alert("File saved successfully!");
    } catch (error) {
      console.error("Error saving CSV file:", error);
      alert("Failed to save the file.");
    }
    closeModal();
  };

  const validateInput = (value) => {
    const rationalRegex = /^(0|[1-9]\d*)(\.\d*)?$/;
    if (value === '' || rationalRegex.test(value)) {
     return true;
    } else {
        return false;
    }
  };

  const openModal = (index) => {
    loadCsvFile(flashcards[index]["csvPath"]);
    setCurrentCard(flashcards[index]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCard(null);
  };

  const loadCsvData = async (path) => {
    try {
      // Get the path of the CSV file
      if(path == null){
        const path = "meta/sample.csv";
      }
      // Read the CSV file
      const data = await window.api.readCsv(path);

    } catch (error) {
      console.error("Error reading CSV file:", error);
    }
  };  

  const handleNext = () => {
    navigate('/analysis', {state: {activityPeaksForGraph, csvData}});
  }

  return (
    <div className="flex flex-col items-center gap-2 justify-center min-h-screen bg-gray-100">
      <div class="w-full flex justify-center items-center text-5xl mb-4 ">
          Metadata control
      </div>
      <div className="grid grid-cols-2 gap-6">
        {flashcards.map((card, index) => (
          <button
            key={index}
            className="btn btn-primary h-16 w-32"
            onClick={() => openModal(index)}
          >
            {card.title}
          </button>
        ))}
      </div>
     
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
              <div className="bg-white shadow-md rounded p-2 " >
              <h2 className="text-xl font-bold">{currentCard.title}</h2>
                <table className="table w-full">
                  <thead>
                    <tr>
                      {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {(cellIndex !== 0 && cellIndex !== 1) ? (<input
                              type="text"
                              value={cell}
                              accept="number"
                              className="input input-bordered w-full"
                              onChange={(e) =>
                                handleEdit(rowIndex, cellIndex, e.target.value)
                              }
                            />) : (
                              <p>{cell}</p>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-center">
                  <button
                    className="btn btn-primary w-1/2"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
              <button onClick={closeModal} className="absolute bg-base-500 top-4 right-4 btn  btn-circle">
                  ×
              </button>
          </div>
        </div>
        )}
      <Dashboard handlerNext={handleNext}/>
    </div>
  );
}

export default Metadata;
