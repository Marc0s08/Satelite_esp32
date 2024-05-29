// Chart.js
import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLegend, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

const Chart = ({ temperatureData, humidityData, heightData }) => {
  return (
    <VictoryChart
      theme={VictoryTheme.material}
      width={window.innerWidth > 600 ? 600 : window.innerWidth - 40}
      height={300}
      scale={{ x: 'time', y: 'linear' }}
      padding={{ top: 40, bottom: 60, left: 60, right: 60 }}
      containerComponent={
        <VictoryVoronoiContainer
          labels={({ datum }) => `${datum.type}: ${datum.y.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          labelComponent={<VictoryTooltip />}
        />
      }
    >
      <VictoryLegend
        x={60}
        y={10}
        orientation="horizontal"
        gutter={20}
        style={{ title: { fontSize: 12 } }}
        data={[
          { name: 'Temperatura (°C)', symbol: { fill: '#c43a31' } },
          { name: 'Umidade (%)', symbol: { fill: '#6b8e23' } },
          { name: 'Altura (m)', symbol: { fill: '#0000FF' } },
        ]}
      />
      <VictoryAxis
        tickFormat={(t) => new Date(t).toLocaleTimeString()}
      />
      <VictoryAxis
        dependentAxis
        tickFormat={(t) => {
          if (t % 1 === 0) {
            return `${t.toFixed(0)} `;
          } else {
            return '';
          }
        }}
      />
      <VictoryLine
        style={{
          data: { stroke: '#c43a31' },
          parent: { border: '1px solid #ccc' },
        }}
        data={temperatureData}
        x="x"
        y="y"
      />
      <VictoryLine
        style={{
          data: { stroke: '#6b8e23' },
          parent: { border: '1px solid #ccc' },
        }}
        data={humidityData}
        x="x"
        y="y"
      />
      <VictoryLine
        style={{
          data: { stroke: '#0000FF' },
          parent: { border: '1px solid #ccc' },
        }}
        data={heightData}
        x="x"
        y="y"
      />
    </VictoryChart>
  );
};

export default Chart;
