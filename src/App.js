import React, { useState, useEffect } from 'react';
import logo from './image/Logo.gif';
import './App.css';
import mqtt from 'mqtt';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer
} from 'victory';
import Map from './Map'; // Importa o componente Map
import 'leaflet/dist/leaflet.css'; // Importa o CSS do Leaflet

const mqttBrokerUrl = 'wss://test.mosquitto.org:8081/ws';
const prefix = 'supernatet/';

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [altitudeData, setAltitudeData] = useState([]);
  const [latestLocation, setLatestLocation] = useState(null);

  useEffect(() => {
    const client = mqtt.connect(mqttBrokerUrl);

    client.on('connect', () => {
      console.log('Conectado ao broker MQTT');
      client.subscribe(`${prefix}temperature`, (err) => {
        if (!err) {
          console.log(`Inscrito em ${prefix}temperature`);
        } else {
          console.error(`Falha ao se inscrever em ${prefix}temperature`, err);
        }
      });
      client.subscribe(`${prefix}humidity`, (err) => {
        if (!err) {
          console.log(`Inscrito em ${prefix}humidity`);
        } else {
          console.error(`Falha ao se inscrever em ${prefix}humidity`, err);
        }
      });
      client.subscribe(`${prefix}location`, (err) => {
        if (!err) {
          console.log(`Inscrito em ${prefix}location`);
        } else {
          console.error(`Falha ao se inscrever em ${prefix}location`, err);
        }
      });
      client.subscribe(`${prefix}altitude`, (err) => {
        if (!err) {
          console.log(`Inscrito em ${prefix}altitude`);
        } else {
          console.error(`Falha ao se inscrever em ${prefix}altitude`, err);
        }
      });
    });

    client.on('message', (topic, message) => {
      const payload = message.toString();
      console.log(`Mensagem recebida: ${topic} = ${payload}`);

      const dataPoint = { x: new Date(), y: parseFloat(payload), type: '' };

      switch (topic) {
        case `${prefix}temperature`:
          dataPoint.type = 'Temperatura (°C)';
          setTemperatureData(prevData => [...prevData.slice(-59), dataPoint]);
          break;
        case `${prefix}humidity`:
          dataPoint.type = 'Umidade (%)';
          setHumidityData(prevData => [...prevData.slice(-59), dataPoint]);
          break;
        case `${prefix}altitude`:
          dataPoint.type = 'Altitude (m)';
          setAltitudeData(prevData => [...prevData.slice(-59), dataPoint]);
          break;
        case `${prefix}location`:
          try {
            const location = JSON.parse(payload);
            setLatestLocation(location);
            console.log('Dados de localização recebidos:', location);
          } catch (error) {
            console.error('Dados de localização inválidos:', payload);
          }
          break;
        default:
          console.warn(`Tópico não tratado: ${topic}`);
          break;
      }
    });

    client.on('error', (err) => {
      console.error('Erro de conexão: ', err);
    });

    const handleReconnect = () => {
      if (!client.connected) {
        client.reconnect();
      }
    };

    const intervalId = setInterval(handleReconnect, 10000); // Verifica a cada 10 segundos

    return () => {
      client.end();
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Satélite Ad Supernatet</h1>
        <p>
          Projeto desenvolvido pela turma de Sábado das 08:00 às 10:00<br/>
          Escola MARTE
        </p>
        <a
          className="App-link2"
          href="https://www.youtube.com/watch?v=1XPxsOhZJQY&ab_channel=ThalesAugusto"
          target="_blank"
          rel="noopener noreferrer"
        >
          .
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
            style={{ parent: { background: '#000000' } }}
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
                { name: 'Altitude (m)', symbol: { fill: '#0000ff' } },
              ]}
            />
            <VictoryAxis
              tickFormat={(t) => new Date(t).toLocaleTimeString()}
            />
            <VictoryAxis
              dependentAxis
              domain={[1, 100]} // Definindo a escala de 1 a 100
              tickValues={[0, 20, 40, 60, 80, 100]} // Valores fixos de 1 a 100
              tickFormat={(t) => `${t.toFixed(0)}`}
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
                data: { stroke: '#0000ff' },
                parent: { border: '1px solid #ccc' },
              }}
              data={altitudeData}
              x="x"
              y="y"
            />
          </VictoryChart>
        </div>
        <div className="map-container">
          {latestLocation ? <Map initialLocation={latestLocation} /> : <p>Carregando Mapa...</p>}
        </div>
      </div>
    </div>
  );
}

export default App;
