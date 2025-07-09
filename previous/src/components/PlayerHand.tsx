import { PieceType } from "../models/Piece";
import { Piece, PieceSize } from "./Piece";

interface PlayerHandProps {
  pieces: PieceType[];
}

export function PlayerHand({ pieces }: PlayerHandProps) {
  return (
    <div className="flex gap-2">
      {pieces.map((piece, index) => (
        <Piece size={PieceSize.ExtraLarge} {...piece} key={index} animated />
      ))}
    </div>
  );
}
