import React, { memo, useRef, useEffect } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import TooltipExample from './tooltip';
import InfoIconWithTooltip from './tooltip';

Chart.register(...registerables, zoomPlugin);

const LineGraph = memo(({data=null, xAxis, yAxis, radius=1, datasets=null, labels=null, xlabel=null, ylabel=null, stepSize=1}) => {
  const chartRef = useRef(null);

  const graphData =  {
    labels: labels === null ? data[xAxis] : labels,
    datasets: datasets === null ? [
      {
        data: data[yAxis],
        fill: false,
        borderColor: '#8884d8',
        tension: 0.1,
        pointRadius: radius,
      },
    ] : datasets,
  } 

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales:{
      x: {
        title: {
          display: true,
          text: xlabel,
          font: {
            size: 16,
          }
        },
        ticks: {
            stepSize: 0.001,
            // min: data[xAxis] != null ? data[xAxis][0] : 0,
            // max: data[xAxis] != null ? data[xAxis][data[xAxis].length - 1] : 1500,
            callback: function(value, index) {
                // Return the label formatted with max 2 decimals
                if(index % stepSize === 0 ){
                  return typeof(this.getLabelForValue(value)) === 'number' ? this.getLabelForValue(value).toFixed(2)
                  : this.getLabelForValue(value)
                } 
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
      }
    },
    plugins: {
      legend: {
          display: false // Disable the legend
      }
    }
  };

  const saveChartAsImage = (format = 'png') => {
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
    link.download = `chart.${format}`;
    link.click();
  };


  return (
    <div class="relative w-3/4 h-3/4 flex justify-center items-center">
        <button className="btn btn-primary btn-sm absolute top-2 right-2 " onClick={() => saveChartAsImage('jpeg')}>
          <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-6"
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
          <Line ref={chartRef} data={graphData} options={options}/>



    </div>
  );
});

export default LineGraph;
