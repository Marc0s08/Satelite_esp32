import React, { useState, useEffect } from 'react';
import logo from './GIF.gif';
import './App.css';
import mqtt from 'mqtt';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLegend, VictoryTooltip, VictoryVoronoiContainer } from 'victory';
import Map from './Map'; // Importa o componente Map
import 'leaflet/dist/leaflet.css'; // Importa o CSS do Leaflet

const mqttBrokerUrl = 'wss://test.mosquitto.org:8081/mqtt';

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [altitudeData, setAltitudeData] = useState([]);
  const [latestLocation, setLatestLocation] = useState({ lat: -15.7942, lng: -47.8822 });

  useEffect(() => {
    const client = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe('temperature');
      client.subscribe('humidity');
      client.subscribe('altitude');
      client.subscribe('location');
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();
      console.log(`Received message: ${topic} = ${payload}`);

      switch (topic) {
        case 'temperature':
          setTemperatureData(prevData => [...prevData, { x: new Date(), y: parseFloat(payload), type: 'Temperatura (°C)' }]);
          break;
        case 'humidity':
          setHumidityData(prevData => [...prevData, { x: new Date(), y: parseFloat(payload), type: 'Umidade (%)' }]);
          break;
        case 'altitude':
          setAltitudeData(prevData => [...prevData, { x: new Date(), y: parseFloat(payload), type: 'Altura (m)' }]);
          break;
        case 'location':
          const location = JSON.parse(payload);
          setLatestLocation(location);
          break;
        default:
          break;
      }
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
    });

    return () => {
      client.end();
    };
  }, []);

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
      <div className="content">
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
              data={altitudeData}
              x="x"
              y="y"
            />
          </VictoryChart>
        </div>
        <div className="map-container">
          <Map initialLocation={latestLocation} />
        </div>
      </div>
    </div>
  );
}

export default App;
