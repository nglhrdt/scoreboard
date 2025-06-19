import mqtt, { MqttClient } from "mqtt";
import { type FC, useEffect, useState } from "react";

type Game = {
  home: number;
  away: number;
  gameID: string;
};

const MqttBoard: FC = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const topic = "table/ads_1/score"; // Define the topic

  const gameToString = (game: Game | null): string => {
    if (!game) return "No game data";
    return `${game.home}:${game.away}`;
  };

  useEffect(() => {
    const mqttClient = mqtt.connect({
      port: 8084,
      host: "mqttws.devilsoft.de",
      protocol: "wss",
    });
    setClient(mqttClient);

    mqttClient.on("connect", () => {
      setConnectionStatus("Connected");
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          console.error("Subscribe error:", err);
        }
      });
    });

    mqttClient.on("message", (topic, payload) => {
      const message = payload.toString();
      try {
        console.log("Received message:", message);
        setGame(JSON.parse(message));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    });

    mqttClient.on("error", (err) => {
      console.error("Connection error: ", err);
      mqttClient.end();
    });

    mqttClient.on("reconnect", () => {
      setConnectionStatus("Reconnecting");
    });

    mqttClient.on("close", () => {
      setConnectionStatus("Disconnected");
    });

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, []);

  if (!client) {
    return null;
  }

  return (
    <div>
      <div style={{ fontSize: "25rem" }}>{gameToString(game)}</div>
    </div>
  );
};

export default MqttBoard;
