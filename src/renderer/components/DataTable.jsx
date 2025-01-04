// components/DataTable.js
import React, { useEffect, useState } from 'react';
import LineGraph from './lineGraph';

const DataTable = ({ data , graphData}) => {

  const peakPlotData = graphData;
  const [overlayOpen, setOverlayOpen] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  const handleClick = (index) => {
    setOverlayOpen(!overlayOpen);
    setCurrentScreen(index);
  }

  const toggleOverlay = () => {
    setOverlayOpen(!overlayOpen);
  }
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nuclide</th>
            <th>Energy (keV)</th>
            <th>Counts</th>
          </tr>
        </thead>
        <tbody>
          {data.map((tableItem, tableIndex) => (
            tableItem.map((item, index) => (
              <tr className='hover:bg-red-100' key={item.id} onClick={() => handleClick(item["name"])}>
                <td>{item["name"].split("_")[0]}</td>
                <td>{(+item["name"].split("_")[1]).toFixed(0)}</td>
                <td>{item["intensity"].toFixed(0)} ± {item["sigma"].toFixed(0)}</td>
              </tr>
              ))
            ))
          }
          
          {overlayOpen && (
                        <div className="w-3/4 max-w-full p-6 rounded-lg flex items-center justify-center z-50">
                        <div className="w-full max-w-full modal modal-open bg-white shadow-lg rounded-lg">
                            <div className="modal-box w-3/4 max-w-full">
                                    <div className="w-full h-[75vh] modal-action flex flex-col items-center justify-center">
                                        <div class="text-5xl mb-8">
                                            {peakPlotData[currentScreen]["name"].split("-")[0].split("_")[0] + " (" + peakPlotData[currentScreen]["name"].split("_")[1] + "keV)"}
                                        </div>
                                        <LineGraph radius={0} xlabel={'Energy (keV)'} ylabel={'Counts'} datasets={peakPlotData[currentScreen]["plotData"]} labels={peakPlotData[currentScreen]["labels"]}/>
                                        <div class="text-3xl mb-8">
                                            Peak Intensity = {Math.abs(peakPlotData[currentScreen]["intensity"].toFixed(0))} ± {peakPlotData[currentScreen]["sigma"].toFixed(0)}
                                        </div>
                                       
                                    </div>
                            </div>
                                    <button onClick={toggleOverlay} className="absolute top-4 right-4 btn btn-sm btn-circle">
                                        ×
                                    </button>
                                </div>
                                </div>
          )}
          
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;