// publish-sensors.js

const mqtt = require('mqtt');

const mqttBrokerUrl = 'wss://test.mosquitto.org:8081/mqtt';
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Publish mock data
  setInterval(() => {
    const temperature = getRandomNumber(20, 30);
    const humidity = getRandomNumber(40, 60);
    const height = getRandomNumber(100, 200);

    client.publish('temperature', temperature.toString(), { qos: 1 });  // Publish temperature with QoS 1
    client.publish('humidity', humidity.toString(), { qos: 1 });        // Publish humidity with QoS 1
    client.publish('height', height.toString(), { qos: 1 });            // Publish height with QoS 1

    console.log(`Published: temperature=${temperature}, humidity=${humidity}, height=${height}`);
  }, 5000);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
