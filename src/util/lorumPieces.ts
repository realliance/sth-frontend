import { PieceType, SuitType } from "../models/Piece";
import { Player } from "../models/Player";
import { Wind } from "../models/Wind";

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

function generatePlayer(num: number): Player {
  return {
    username: `Player${num}`,
    points: Math.floor(Math.random() * 20000),
    discardPile: generatePieces(15),
  };
}

export function generatePlayers() {
  return {
    [Wind.East]: generatePlayer(1),
    [Wind.South]: generatePlayer(2),
    [Wind.West]: generatePlayer(3),
    [Wind.North]: generatePlayer(4),
  };
}
