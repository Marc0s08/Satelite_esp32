// App.js
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import mqtt from 'mqtt';
import Chart from './Chart';

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
        <Chart 
          temperatureData={temperatureData} 
          humidityData={humidityData} 
          heightData={heightData} 
        />
      </div>
    </div>
  );
}

export default App;
