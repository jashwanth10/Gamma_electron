import React from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

const ScatterAndLineGraph = ({data1, data2, xlabel=null, ylabel=null}) => {
const data = {
    datasets: [
        {
            type: 'line',
            label: 'Line Dataset',
            data: data1,
            borderColor: '#8884d8',
            tension: 0.1,
            pointRadius: 1,
        },
        {
            type: 'scatter',
            backgroundColor: 'rgb(255, 99, 132)',
            data: data2
        }
    ],
}
  
  
const options =  {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            type: 'linear',
            position: 'bottom',
            ticks: {
                callback: function(value, index, values) {
                    return value.toFixed(2); // Format numbers with 2 decimal places
                }
            },
            title: {
                display: true,
                text: xlabel,
                font: {
                  size: 16,
                }           

              }
        },
        
        y: {
            beginAtZero: true,
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
}


  return (
    <div class="w-3/4 h-3/4 flex justify-center items-center ">
        <Line data={data} options={options}></Line>
    </div>
  );
};

export default ScatterAndLineGraph;
