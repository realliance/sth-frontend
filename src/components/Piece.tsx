import { motion } from "motion/react"
import { PieceType, SuitType } from "../models/Piece";

export enum PieceSize {
  Small = "small",
  Large = "large",
}

function getPieceImagePath(suit: SuitType, rank: number, faceDown: boolean, isRed?: boolean) {
  const basePath = "/pieces/";

  if (faceDown) {
    return `${basePath}Back.svg`;
  }

  const redSuffix = isRed ? "-Dora" : "";

  if (suit === SuitType.Honor) {
    const honorPieces = [
      "Red",
      "White",
      "Green",
      "North",
      "South",
      "East",
      "West",
    ];

    return `${basePath}${honorPieces[rank]}.svg`;
  } else {
    return `${basePath}${suit}${rank}${redSuffix}.svg`;
  }
}

function getRotationClass(rotation: number) {
  const rotationClasses = ["", "rotate-90", "rotate-180", "rotate-270"];

  return rotationClasses[rotation % 4];
}

function getSizeClasses(rotation: number, size: PieceSize = PieceSize.Large) {
  if (size === PieceSize.Small) {
    return rotation % 2 === 0 ? "w-6 h-8" : "w-8 h-6";
  }
  return rotation % 2 === 0 ? "w-12 h-16" : "w-16 h-12";
}

function getRotatedPaddingClass(
  rotation: number,
  size: PieceSize = PieceSize.Large
) {
  if (rotation % 2 === 0) return "";
  return size === PieceSize.Small ? "my-1" : "my-3";
}

function getImageSizeClass(size: PieceSize = PieceSize.Large) {
  return size === PieceSize.Small ? "w-6 h-8" : "w-12 h-16";
}

interface IPiece extends PieceType {
  rotation?: number;
  size?: PieceSize;
  animated?: boolean;
}

export const Piece = ({
  suit,
  rank,
  rotation = 0,
  size = PieceSize.Large,
  animated = false,
  faceDown = false,
}: IPiece) => (
  <motion.div
    whileHover={animated ? { bottom: 10 } : undefined}
    className={`relative ${getSizeClasses(
      rotation,
      size
    )} ${getRotatedPaddingClass(rotation, size)}`}
  >
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={`${
          rotation % 2 == 0 ? "" : "transform origin-center"
        } ${getRotationClass(rotation)}`}
      >
        <img
          src={getPieceImagePath(suit, rank, faceDown)}
          alt={`${suit} ${rank}`}
          className={`relative z-10 object-contain ${getImageSizeClass(size)}`}
        />
        <img
          src="/pieces/Front.svg"
          alt="Back"
          className="absolute inset-0 z-0 object-contain"
        />
      </div>
    </div>
  </motion.div>
);
