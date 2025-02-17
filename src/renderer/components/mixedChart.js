import React, {useRef} from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const MixedChart = ({lineData, scatterData, xlabel="Channel", ylabel="Energy (keV)", name="chart"}) => {
  const chartRef = useRef(null);
  const options = {
    scales: {
        x: {
            title: {
              display: true,
              text: xlabel,
              font: {
                size: 16,
              }
            }
        },
        y: {
            title: {
                display: true,
                text: ylabel,
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
    plugins: {
        legend: {
            display: false // Disable the legend
        }
    }
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
  const saveChartAsImage = (format = 'png', name = 'chart') => {
    const chart = chartRef.current;
    if (!chart) return;

    const canvas = chart.canvas;

    // Set canvas background color to white before exporting
    const ctx = canvas.getContext('2d');
    ctx.save(); // Save the original state
    ctx.globalCompositeOperation = 'destination-over'; // Draw the background beneath existing content
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore(); // Restore to the original state


    // Get the base64 image string
    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const base64Image = chart.toBase64Image(mimeType); // Format can be 'image/png' or 'image/jpeg'

    // Create a download link
    const link = document.createElement('a');
    link.href = base64Image;
    link.download = `${name}.${format}`;
    link.click();
  };

  return (
    <div class="relative w-3/4 h-3/4 flex justify-center items-center">
      <button className="btn btn-primary btn-sm absolute top-2 right-2 " onClick={() => saveChartAsImage('jpeg', name)}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
        />
        </svg>
      </button>
    <Scatter ref={chartRef} options={options} data={data} />
    </div>
)};

export default MixedChart;