import { Player } from "../models/Player";
import { Wind } from "../models/Wind";

interface ScorePanelProps {
  players: {
    [key in Wind]: Player;
  };
  dealerWind: Wind;
}

export function ScorePanel({ players, dealerWind }: ScorePanelProps) {
  // Sort players by score (highest first)
  const sortedPlayers = Object.entries(players)
    .map(([wind, player]) => ({
      wind: wind as Wind,
      player,
      isDealer: wind === dealerWind,
    }))
    .sort(
      (a, b) =>
        (b.player.score ?? b.player.points) -
        (a.player.score ?? a.player.points),
    );

  return (
    <div className="bg-slate-800/95 rounded-lg shadow-lg border border-slate-700 p-3 w-full h-auto max-w-xs text-slate-100">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="border-b border-slate-700 pb-1">
          <h2 className="text-lg font-bold">Scores</h2>
        </div>

        {/* Player List */}
        <div className="flex flex-col gap-1">
          {sortedPlayers.map(({ wind, player, isDealer }) => (
            <div
              key={wind}
              className="flex items-center justify-between py-1 border-b border-slate-700/50 last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* Player indicator with dealer marker if applicable */}
                <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full">
                  <span
                    className={`text-md font-bold ${isDealer ? "text-yellow-300" : ""}`}
                  >
                    {wind.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-sm">
                  {player.name ?? player.username}
                </span>
              </div>
              <span className="text-base font-bold">
                {player.score ?? player.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
