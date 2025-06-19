import mqtt from "mqtt";
import { createContext, useContext, useEffect, useState } from "react";

interface MqttContextType {
  client: mqtt.MqttClient | null;
  connectionStatus: string;
}

const MqttContext = createContext<MqttContextType>({
  client: null,
  connectionStatus: "Disconnected",
});

export function useMqtt() {
  return useContext(MqttContext);
}

export function MqttProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");

  useEffect(() => {
    setConnectionStatus("Connecting...");
    const mqttClient = mqtt.connect({
      port: 8883,
      host: "mqtt.devilsoft.de",
      protocol: "mqtts",
    });
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setConnectionStatus("Connected");
      console.log("Connected to MQTT broker");
    });

    mqttClient.on("reconnect", () => {
      setConnectionStatus("Reconnecting...");
    });

    mqttClient.on("error", (err) => {
      setConnectionStatus("Connection Error");
      console.error("Connection error:", err);
      mqttClient.end();
    });

    mqttClient.on("close", () => {
      setConnectionStatus("Disconnected");
    });

    // Cleanup on component unmount
    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  const value = {
    client,
    connectionStatus,
  };

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
}
