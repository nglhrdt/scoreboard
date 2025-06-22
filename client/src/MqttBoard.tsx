import mqtt, { MqttClient } from "mqtt";
import { type FC, useEffect, useState } from "react";

type Game = {
  score: {
    home: number;
    away: number;
  };
  players: {
    home: string[];
    away: string[];
  };
  gameID: string;
};

const MqttBoard: FC = () => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const topic = "table/ads_1/game"; // Define the topic

  const getScore = (game: Game | null): string => {
    if (!game) return "No game data";
    return `${game.score.home}:${game.score.away}`;
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
        console.log(`Received message: ${topic}` , message);
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
      <div style={{ fontSize: "25rem" }}>{getScore(game)}</div>
      <div style={{ fontSize: "2rem" }}>
        {game ? `Game ID: ${game.gameID}` : "No game data"}
      </div>
      <div>
        <div style={{ fontSize: "2rem" }}>
          {game
            ? `Home Players: ${game.players.home.join(", ")}`
            : "No home players"}
        </div>
        <div style={{ fontSize: "2rem" }}>
          {game
            ? `Away Players: ${game.players.away.join(", ")}`
            : "No away players"}
        </div>
      </div>
      <div style={{ fontSize: "1.5rem", marginTop: "20px" }}>
        Connection Status: {connectionStatus}
      </div>
    </div>
  );
};

export default MqttBoard;
