import React from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

const LineGraph = ({data=null, xAxis, yAxis, radius=1, datasets=null, labels=null, xlabel=null, ylabel=null, stepSize=1}) => {

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

  return (
    <div class="w-3/4 h-3/4 flex justify-center items-center">
        <Line data={graphData} options={options}/>
    </div>
  );
};

export default LineGraph;
