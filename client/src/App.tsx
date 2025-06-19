import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Board from "./Board";
import MqttBoard from "./MqttBoard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
      <MqttBoard />
    </QueryClientProvider>
  );
}

export default App;
