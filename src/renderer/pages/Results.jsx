import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Dashboard from "../components/dashboard";


function Results() {
    const location = useLocation();
    const tableData = location.state?.finalData || null;
    const [data, setData] = useState(null);

    useEffect(() => {
        // fetch required peaks details;
        setData(tableData);
    }, [])

    
    return (
       <div className="flex flex-col items-center justify-center min-h-screen">
        <table className="table table-zebra w-3/4">
            <thead>
            <tr>
                <th className="text-left text-xl"></th>
                <th className="text-left text-3xl">²³⁸U</th>
                <th className="text-left text-3xl">²²⁶Ra</th>
                <th className="text-left text-3xl">²¹⁰Pb</th>
                <th className="text-left text-3xl">²³²Th</th>
                <th className="text-left text-3xl">⁴⁰K</th>
            </tr>
            </thead>
            <tbody>
                    <tr key={1}>
                        <th>Abundance(Bq/kg)</th>
                        <td>{tableData[1]["238U"][0].toFixed(2)} ± {tableData[1]["238U"][1].toFixed(2)}</td>
                        <td>{tableData[1]["226Ra"][0].toFixed(2)} ± {tableData[1]["226Ra"][1].toFixed(2)}</td>
                        <td>{tableData[1]["210Pb"][0].toFixed(2)} ± {tableData[1]["210Pb"][1].toFixed(2)}</td>
                        <td>{tableData[1]["232Th"][0].toFixed(2)} ± {tableData[1]["232Th"][1].toFixed(2)}</td>
                        <td>{tableData[1]["40K"][0].toFixed(2)} ± {tableData[1]["40K"][1].toFixed(2)}</td>
                     </tr>
                
            </tbody>
        </table>
        <Dashboard handlerNext={() => {}} showNext={false}/>

        </div>


        
    )
}

export default Results;