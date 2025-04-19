import { PieceType } from "../models/Piece";
import { Wind } from "../models/Wind";
import { Piece } from "./Piece";

interface DiscardPileProps {
  wind?: Wind;
  rotation?: number;
  pieces: PieceType[];
}

function getGridClasses(rotation: number) {
  return rotation % 2 === 0 ? "grid-cols-7" : "grid-rows-7";
}

export const DiscardPile = ({ rotation, pieces, wind }: DiscardPileProps) => (
  <div>
    {wind && <p>{wind}</p>}
    <div className={`grid gap-2 ${getGridClasses(rotation || 0)}`}>
      {pieces.map((piece, index) => (
        <Piece {...piece} key={index} rotation={rotation || 0} />
      ))}
    </div>
  </div>
);
