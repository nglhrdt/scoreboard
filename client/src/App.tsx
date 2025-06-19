import "./App.css";
import { MqttProvider } from "./MqttProvider";

function App() {
  return (
    <MqttProvider>
      <div style={{ fontSize: "25rem" }}>0:0</div>
    </MqttProvider>
  );
}

export default App;
