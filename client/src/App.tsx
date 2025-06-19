import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import Board from "./Board";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  );
}

export default App;
