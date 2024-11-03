import React from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const MixedChart = ({lineData, scatterData}) => {
  const options = {
    scales: {
        x: {
            title: {
              display: true,
              text: "Channel",
              font: {
                size: 16,
              }
            }
        },
        y: {
            title: {
                display: true,
                text: "Energy (keV)",
                font: {
                size: 16,
                }
            }
        },
    },
    elements: {
        line: {
            borderWidth: 0.5,  // Global setting for all lines
            tension: 0,         // Keeps the line sharp (no curves)
        },
    },
  };

  const data = {
    datasets: [
      {
        type: 'scatter',
        label: 'Scatter Dataset',
        data: scatterData,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1

      },
      {
        type: 'line',
        label: 'Line Dataset',
        data: lineData,
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderWidth: 0.5,
        pointRadius: 0
      },
    ],
  };

  return <Scatter options={options} data={data} />;
};

export default MixedChart;