import { PieceType } from "./Piece";

export interface Player {
  username: string;
  points: number;
  discardPile: PieceType[];
}
