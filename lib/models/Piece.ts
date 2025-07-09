export enum SuitType {
  Sou = "Sou",
  Man = "Man",
  Pin = "Pin",
  Honor = "Honor",
}

export interface PieceType {
  suit: SuitType;
  rank: number;
  isRed?: boolean;
  faceDown?: boolean;
}
