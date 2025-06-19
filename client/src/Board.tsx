import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

interface BoardProps {
  data?: unknown;
}

const Board: FC<BoardProps> = () => {
  const { data } = useQuery({
    queryKey: ["lastGame"],
    queryFn: async () => {
      const res = await fetch(
        "https://scoreboard.devilsoft.de/api/v1/games/last"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    refetchInterval: 1000,
  });

  return (
    <div>
      <div style={{ fontSize: "25rem" }}>{data && JSON.stringify(data)}</div>
      <button>Start</button>
    </div>
  );
};

export default Board;
