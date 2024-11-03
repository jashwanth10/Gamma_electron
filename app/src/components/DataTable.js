// components/DataTable.js
import React from 'react';

const DataTable = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th>Name</th>
            <th>Energy (keV)</th>
            <th>Intensity</th>
            <th>Sigma</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <th>{index + 1}</th>
              <td>{item["name"].split("_")[0]}</td>
              <td>{(+item["name"].split("_")[1]).toFixed(0)}</td>
              <td>{item["intensity"].toFixed(0)}</td>
              <td>{item["sigma"].toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;