import mqtt, { MqttClient } from 'mqtt';
import { type FC, useEffect, useState } from 'react';

const MqttBoard: FC = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const topic = 'scoreboard/messages'; // Define the topic

  useEffect(() => {
    const mqttClient = mqtt.connect({
      port: 8084,
      host: 'mqttws.devilsoft.de',
      protocol: 'wss',
    });
    setClient(mqttClient);

    mqttClient.on('connect', () => {
      setConnectionStatus('Connected');
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscribe error:', err);
        }
      });
    });

    mqttClient.on('message', (topic, payload) => {
      const message = payload.toString();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error: ', err);
      mqttClient.end();
    });

    mqttClient.on('reconnect', () => {
      setConnectionStatus('Reconnecting');
    });

    mqttClient.on('close', () => {
      setConnectionStatus('Disconnected');
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  return (
    <div>
      <h2>MQTT Board</h2>
      <p>Connection Status: {connectionStatus}</p>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MqttBoard;
