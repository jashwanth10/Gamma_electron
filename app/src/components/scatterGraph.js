import React from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(...registerables, zoomPlugin);

const ScatterGraph = ({data, xlabel=null, ylabel=null}) => {
  const graphData =  {
    datasets: [
      {
        data: data,
        backgroundColor: 'rgb(255, 99, 132)'
      },
    ],
  } 

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        grid: {
            display: false,
        },
        position: 'bottom',
        title: {
          display: true,
          text: xlabel,
          font: {
            size: 16,
          }
        }
      },
      y: {
        grid: {
            drawBorder: false,
            color: (context) => {
                if(context.tick.value === 0){
                    return 'red'
                }
            }
        },
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
    <div class="w-3/4 h-3/4 flex justify-center items-center">
        <Scatter data={graphData} options={options}/>
    </div>
  );
};

export default ScatterGraph;
