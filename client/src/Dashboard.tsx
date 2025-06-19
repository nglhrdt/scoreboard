import { useEffect, useState } from "react";
import { useMqtt } from "./MqttProvider";

function Dashboard() {
  const { client, connectionStatus } = useMqtt();
  const [messages, setMessages] = useState<string[]>([]);
  const topic = "react/mqtt/test";

  useEffect(() => {
    if (client && connectionStatus === "Connected") {
      // Subscribe to a topic
      client.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscription error:", err);
        }
      });

      // Handle incoming messages
      client.on("message", (receivedTopic, payload) => {
        if (receivedTopic === topic) {
          const newMessage = `Topic: ${receivedTopic}, Message: ${payload.toString()}`;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // Cleanup on component unmount or client change
      return () => {
        client.unsubscribe(topic);
        client.removeAllListeners("message");
      };
    }
  }, [client, connectionStatus, topic]);

  const publishMessage = () => {
    if (client && connectionStatus === "Connected") {
      const message = `Hello from React at ${new Date().toLocaleTimeString()}`;
      client.publish(topic, message, (err) => {
        if (err) {
          console.error("Publish error:", err);
        }
      });
    }
  };

  return (
    <div>
      <h2>MQTT Dashboard</h2>
      <p>
        Connection Status: <strong>{connectionStatus}</strong>
      </p>
      <button
        onClick={publishMessage}
        disabled={connectionStatus !== "Connected"}
      >
        Publish Message
      </button>
      <h3>Received Messages on topic '{topic}':</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
