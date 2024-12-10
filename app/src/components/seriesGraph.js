import React from 'react';
import { VictoryChart, VictoryScatter, VictoryLine, VictoryErrorBar, VictoryTooltip, VictoryAxis } from 'victory';

const data = [
  { x: 63.29, y: 1.02, errorY: 0.1 },
  { x: 92.59, y: 1.29, errorY: 0.15 },
  // Add more data points here
];

const trendlineData = [
  { x: 0, y: 20 },
  { x: 1500, y: 20 },
];

const trendlineData1 = [
    { x: 0, y: 40 },
    { x: 1500, y: 40 },
  ];

function SeriesGraph({scatterData, lineData}) {

    var filteredScatterData = []
    scatterData.map((data) => {
        const x = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => (key!=="label"))
        );
        filteredScatterData.push(x);
    })
    return (
        <VictoryChart
            width={700}
            domain={{ x: [0, 1500], y: [0, 100] }}
        >
        <VictoryAxis
            label="Energy (keV)" // Label for the x-axis
            tickValues={[0, 250, 500, 750, 1000, 1250, 1500]} // Custom tick values for x-axis
            style={{
            axisLabel: { padding: 30 },
            ticks: { stroke: "#000", size: 5 }, // Customize tick mark size and color
            tickLabels: { fontSize: 10 } // Customize tick label font size
            }}
        />
         <VictoryAxis
            dependentAxis
            label="Activity (Bq/kg)" // Label for the y-axis
            tickValues={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} // Custom tick values for y-axis
            style={{
            axisLabel: { padding: 40 },
            ticks: { stroke: "#000", size: 5 }, // Customize tick mark size and color
            tickLabels: { fontSize: 10 } // Customize tick label font size
            }}
        />

       
        <VictoryErrorBar
            data={filteredScatterData}
            errorY={(datum) => datum.errorY}
            style={{ data: { stroke: "black" } }}
        />
        <VictoryLine
            data={lineData[0][0]}
            style={{ data: { stroke: "red", strokeWidth: 2 } }}
        />
        <VictoryLine
            data={lineData[0][1]}
            style={{ data: { stroke: "red", strokeWidth: 2 } }}
        />
        <VictoryLine
            data={lineData[1][0]}
            style={{ data: { stroke: "red", strokeWidth: 2, strokeDasharray: "5,5" } }}
        />
        <VictoryLine
            data={lineData[1][1]}
            style={{ data: { stroke: "red", strokeWidth: 2, strokeDasharray: "5,5" } }}
        />
        <VictoryLine
            data={lineData[2][0]}
            style={{ data: { stroke: "blue", strokeWidth: 2 } }}
        />
        <VictoryLine
            data={lineData[2][1]}
            style={{ data: { stroke: "blue", strokeWidth: 2 } }}
        />
        {lineData.length > 3 && (
            <div>
                <VictoryLine
                data={lineData[3][0]}
                style={{ data: { stroke: "blue", strokeWidth: 2, strokeDasharray: "5,5" } }}
                />
                <VictoryLine
                    data={lineData[3][1]}
                    style={{ data: { stroke: "blue", strokeWidth: 2, strokeDasharray: "5,5" } }}
                />
            </div>
        )}
         <VictoryScatter
            data={scatterData}
            style={{ data: { fill: "black" } }}
            labels={({datum}) => datum.label}
            labelComponent={<VictoryTooltip />}
        />
        
        
        </VictoryChart>
    );
}

export default SeriesGraph;