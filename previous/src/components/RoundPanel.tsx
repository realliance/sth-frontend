import { useMemo } from "react";
import { PieceType, SuitType } from "../models/Piece";
import { Wind } from "../models/Wind";
import { Piece, PieceSize } from "./Piece";

interface RoundPanelProps {
  roundWind: Wind;
  roundNumber: number;
  wallTilesRemaining: number;
  honbaSticks: number;
  riichiSticks: number;
  doraTiles: PieceType[];
  maxDoraTiles: number;
}

export function RoundPanel({
  roundWind,
  roundNumber,
  wallTilesRemaining,
  honbaSticks,
  riichiSticks,
  doraTiles,
  maxDoraTiles,
}: RoundPanelProps) {
  const doraList = useMemo(() => {
    return Array.from({ length: maxDoraTiles }, (_, i) => {
      return (
        <Piece
          key={i}
          suit={doraTiles[i]?.suit ?? SuitType.Sou}
          rank={doraTiles[i]?.rank ?? 0}
          size={PieceSize.Small}
          faceDown={doraTiles[i] === undefined}
        />
      );
    });
  }, [doraTiles, maxDoraTiles]);

  return (
    <div className="bg-slate-800/95 rounded-lg shadow-lg border border-slate-700 p-4 w-full max-w-xs text-slate-100">
      <div className="flex flex-col gap-3">
        {/* Round information */}
        <div className="flex flex-row items-center gap-2 border-b border-slate-700 pb-2">
          <p className="text-2xl font-bold italic">{roundWind}</p>
          <p className="text-2xl font-bold">{roundNumber}</p>
        </div>

        {/* Wall tiles */}
        <div className="flex flex-row items-center gap-2">
          <Piece faceDown suit={SuitType.Sou} rank={0} size={PieceSize.Small} />
          <p className="text-lg font-bold">
            {wallTilesRemaining} tiles remaining
          </p>
        </div>

        {/* Sticks */}
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-1">
            <p className="text-slate-300">Honba:</p>
            <p className="text-lg font-bold">{honbaSticks}</p>
          </div>
          <div className="flex flex-row items-center gap-1">
            <p className="text-slate-300">Riichi:</p>
            <p className="text-lg font-bold">{riichiSticks}</p>
          </div>
        </div>

        {/* Dora tiles */}
        <div className="border-t border-slate-700 pt-3">
          <div className="flex flex-row gap-1">{doraList}</div>
        </div>
      </div>
    </div>
  );
}
