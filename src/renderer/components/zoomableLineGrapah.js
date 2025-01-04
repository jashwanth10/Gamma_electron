import React from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

const ZoomableLineGraph = ({data, xAxis, yAxis, type, width="800px", height="100px"}) => {
  // Initial zoom settings
  // data = {
  //   "xAxis": [],
  //   "yAxis": []
  // }
  const verticalLinesData = (type=="Scatter") ? data[xAxis].map((xVal, index) => ({
    data: [
        { x: index, y: data[yAxis][index] }, // Point
        { x: index, y: 0 },
    ],
    fill: false,
    borderColor: 'rgba(192,75,75,1)',
    borderWidth: 1,
    pointRadius: 0, // Hide the points on the line
    showLine: true, // Draw the line
  })) : {}
  const graphData = (type == "Line" || type == null) ? {
    labels: data[xAxis],
    datasets: [
      {
        label: 'Values',
        data: data[yAxis],
        fill: false,
        borderColor: '#8884d8',
        tension: 0.1,
        pointRadius: 1,
        pointHoverRadius: 8,
      },
    ],
  } : {
    datasets: [
      {
        label: 'Values',
        data: data[xAxis].map((xVal, index) => ({ x: parseInt(xVal), y: data[yAxis][index], z: xVal })),
        fill: false,
        borderColor: '#8884d8',
        pointRadius: 3,
        showLine: false, // Fixed size of dots
      },
      ...verticalLinesData
    ],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Value: ${tooltipItem.raw.z}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Channels',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Counts',
        },
      },
    },
    elements: {
      point: {
        radius: type === 'Scatter' ? 5 : 0, // Show dots only in scatter plot
      },
      line: {
        tension: 0.4, // Set line tension to smooth curves
      },
    },
  };

  return (
    <div class="w-3/4 h-3/4 flex justify-center items-center">
        {(type == "Line" || type == null) && (
          <Line data={graphData} options={options}/>
        )}
        {type == "Scatter" && (
          <Scatter data={graphData} options={options}/>
        )}
    </div>
  );
};

export default ZoomableLineGraph;
