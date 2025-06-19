import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

const Board: FC = () => {
  const { data } = useQuery({
    queryKey: ["lastGame"],
    queryFn: async () => {
      const res = await fetch(
        "https://scoreboard.devilsoft.de/api/v1/games/last"
      );
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    refetchInterval: 60000,
  });

  return (
    <div>
      <div style={{ fontSize: "25rem" }}>
        {data && `${data.home}:${data.away}`}
      </div>
      <p>{data && data._id}</p>
    </div>
  );
};

export default Board;
