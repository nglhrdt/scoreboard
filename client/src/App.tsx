import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import MqttBoard from "./MqttBoard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MqttBoard />
    </QueryClientProvider>
  );
}

export default App;
