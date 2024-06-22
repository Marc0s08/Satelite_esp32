const mqtt = require('mqtt');

const mqttBrokerUrl = 'wss://test.mosquitto.org:8081/mqtt';
const client = mqtt.connect(mqttBrokerUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Publish mock data
  setInterval(() => {
    const temperature = getRandomNumber(20, 30);
    const humidity = getRandomNumber(40, 45);
    const height = getRandomNumber(0, 1);
    const latitude = getRandomNumber(-22.220179, -22.220180);  // Brasília latitude range
    const longitude = getRandomNumber(-49.943691, -49.943692); // Brasília longitude range
    const location = JSON.stringify({ lat: latitude, lng: longitude });

    client.publish('supernat/temperature', temperature.toString(), { qos: 1 });
    client.publish('supernat/humidity', humidity.toString(), { qos: 1 });
    client.publish('supernat/altitude', height.toString(), { qos: 1 });
    client.publish('supernat/location', location, { qos: 1 });

    console.log(`Published: temperature=${temperature}, humidity=${humidity}, altitude=${height}, location=${location}`);
  }, 5000);
});

client.on('error', (err) => {
  console.error('Connection error:', err);
});

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
