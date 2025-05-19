import { PieceType } from "./Piece";
import { MeldType, MeldOrientation } from "../components/PieceMeld";

// Interface for a meld group, also defined in DiscardPile
export interface MeldGroup {
  type: MeldType;
  pieces: PieceType[];
  orientation?: MeldOrientation;
}

export interface Player {
  username: string;
  name?: string; // Optional name property (will fallback to username if not set)
  points: number;
  score?: number; // Alias for points
  discardPile: PieceType[];
  melds?: MeldGroup[];
}
