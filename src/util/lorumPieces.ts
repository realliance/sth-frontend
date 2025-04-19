import { PieceType, SuitType } from "../models/Piece";

export function generatePieces(num: number): PieceType[] {
  const suits = Object.values(SuitType);

  return Array.from({ length: num }, () => {
    let suit = suits[Math.floor(Math.random() * suits.length)];
    if (suit === SuitType.Honor) {
      return {
        suit: suit,
        rank: Math.floor(Math.random() * 7),
      };
    } else {
      return {
        suit: suit,
        rank: Math.floor(Math.random() * 9) + 1,
      };
    }
  });
}
