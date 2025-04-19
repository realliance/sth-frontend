import { PieceType } from "../models/Piece";
import { Piece } from "./Piece";

interface PlayerHandProps {
  pieces: PieceType[];
}

export function PlayerHand({ pieces }: PlayerHandProps) {
  return (
    <div className="flex gap-2">
      {pieces.map((piece, index) => (
        <Piece {...piece} key={index} />
      ))}
    </div>
  );
}
