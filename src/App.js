import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import mqtt from 'mqtt';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLegend, VictoryTooltip, VictoryVoronoiContainer } from 'victory';

const mqttBrokerUrl = 'wss://test.mosquitto.org:8081/mqtt';

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [heightData, setHeightData] = useState([]);

  useEffect(() => {
    const client = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('temperature');
      client.subscribe('humidity');
      client.subscribe('height');
    });

    client.on('message', (topic, message) => {
      const payload = parseFloat(message.toString());
      console.log(`Received message: ${topic} = ${payload}`);

      switch (topic) {
        case 'temperature':
          setTemperatureData(prevData => [...prevData, { x: new Date(), y: payload, type: 'Temperatura (°C)' }]);
          break;
        case 'humidity':
          setHumidityData(prevData => [...prevData, { x: new Date(), y: payload, type: 'Umidade (%)' }]);
          break;
        case 'height':
          setHeightData(prevData => [...prevData, { x: new Date(), y: payload, type: 'Altura (m)' }]);
          break;
        default:
          break;
      }
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
    });

    const interval = setInterval(() => {
      client.publish('temperature', getRandomNumber(20, 30).toString());
      client.publish('humidity', getRandomNumber(40, 60).toString());
      client.publish('height', getRandomNumber(100, 200).toString());
    }, 60000);

    return () => {
      clearInterval(interval);
      client.end();
    };
  }, []);

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Satélite Ad Supernat</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div className="chart-container">
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
      </div>
    </div>
  );
}

export default App;
