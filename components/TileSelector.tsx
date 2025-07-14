import React, { useState } from "react";
import { Piece, PieceSize } from "./Piece";
import { PieceType, SuitType } from "../lib/models/Piece";

interface TileSelectorProps {
  selectedTile: string;
  onTileSelect: (tile: string) => void;
  disabled?: boolean;
}

const TILES_BY_SUIT = {
  Man: ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m"],
  Sou: ["1s", "2s", "3s", "4s", "5s", "6s", "7s", "8s", "9s"],
  Pin: ["1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p"],
  Honor: ["east", "south", "west", "north", "white", "green", "red"],
};

const tileStringToPiece = (tileStr: string): PieceType => {
  if (
    ["east", "south", "west", "north", "white", "green", "red"].includes(
      tileStr,
    )
  ) {
    const honorRanks = {
      red: 0,
      white: 1,
      green: 2,
      north: 3,
      south: 4,
      east: 5,
      west: 6,
    };
    return {
      suit: SuitType.Honor,
      rank: honorRanks[tileStr as keyof typeof honorRanks],
    };
  }

  const rank = parseInt(tileStr[0]);
  const suitChar = tileStr[1];
  const suitMap = { m: SuitType.Man, p: SuitType.Pin, s: SuitType.Sou };

  return { suit: suitMap[suitChar as keyof typeof suitMap], rank };
};

const getSuitFromTile = (tile: string): string => {
  if (
    ["east", "south", "west", "north", "white", "green", "red"].includes(tile)
  ) {
    return "Honor";
  }
  const suitChar = tile[1];
  const suitMap = { m: "Man", p: "Pin", s: "Sou" };
  return suitMap[suitChar as keyof typeof suitMap];
};

export const TileSelector: React.FC<TileSelectorProps> = ({
  selectedTile,
  onTileSelect,
  disabled = false,
}) => {
  const initialSuit = getSuitFromTile(selectedTile);
  const [activeSuit, setActiveSuit] = useState(initialSuit);

  return (
    <div className="space-y-4">
      <div className="tabs tabs-boxed">
        {Object.keys(TILES_BY_SUIT).map((suitName) => (
          <button
            key={suitName}
            type="button"
            className={`tab ${activeSuit === suitName ? "tab-active" : ""}`}
            onClick={() => setActiveSuit(suitName)}
            disabled={disabled}
          >
            {suitName}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {TILES_BY_SUIT[activeSuit as keyof typeof TILES_BY_SUIT].map((tile) => {
          const piece = tileStringToPiece(tile);
          const isSelected = tile === selectedTile;

          return (
            <button
              key={tile}
              type="button"
              onClick={() => onTileSelect(tile)}
              disabled={disabled}
              className={`
                p-2 rounded-lg transition-all
                ${
                  isSelected
                    ? "ring-1 ring-primary"
                    : "hover:bg-base-200"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <Piece
                suit={piece.suit}
                rank={piece.rank}
                size={PieceSize.Large}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
