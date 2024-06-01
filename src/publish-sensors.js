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
    const latitude = getRandomNumber(-15.8349, -15.7934);  // Brasília latitude range
    const longitude = getRandomNumber(-47.9417, -47.8823); // Brasília longitude range
    const location = JSON.stringify({ lat: latitude, lng: longitude });

    client.publish('temperature', temperature.toString(), { qos: 1 });
    client.publish('humidity', humidity.toString(), { qos: 1 });
    client.publish('altitude', height.toString(), { qos: 1 });
    client.publish('location', location, { qos: 1 });

    console.log(`Published: temperature=${temperature}, humidity=${humidity}, altitude=${height}, location=${location}`);
  }, 5000);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
