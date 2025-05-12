import { useMemo } from "react";
import { PieceType, SuitType } from "../models/Piece";
import { Wind } from "../models/Wind";
import { Piece, PieceSize } from "./Piece";

interface ScorePanelProps {
  roundWind: Wind;
  roundNumber: number;
  wallTilesRemaining: number;
  honbaSticks: number;
  riichiSticks: number;
  doraTiles: PieceType[];
  maxDoraTiles: number;
}

export function ScorePanel({ roundWind, roundNumber, wallTilesRemaining, honbaSticks, riichiSticks, doraTiles, maxDoraTiles }: ScorePanelProps) {
  const doraList = useMemo(() => {
    return Array.from({ length: maxDoraTiles }, (_, i) => {
      return <Piece suit={doraTiles[i]?.suit ?? SuitType.Sou} rank={doraTiles[i]?.rank ?? 0} size={PieceSize.Small} faceDown={doraTiles[i] === undefined} />
    })
  }, [doraTiles, maxDoraTiles])

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex flex-row items-center gap-2">
        <p className="text-2xl font-bold italic">{roundWind}</p>
        <p className="text-2xl font-bold">{roundNumber}</p>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Piece faceDown suit={SuitType.Sou} rank={0} size={PieceSize.Small} />
        <p className="text-lg font-bold">{wallTilesRemaining}</p>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row items-center gap-1">
          <p className="text-lg font-bold">Honba</p>
          <p className="text-lg font-bold">{honbaSticks}</p>
        </div>
        <div className="flex flex-row items-center gap-1">
          <p className="text-lg font-bold">Riichi</p>
          <p className="text-lg font-bold">{riichiSticks}</p>
        </div>
        
      </div>
      <div className="flex flex-row items-center gap-1">
        {doraList}
      </div>
    </div>
  );
}