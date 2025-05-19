import { motion } from "motion/react";
import { PieceType, SuitType } from "../models/Piece";

export enum PieceSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
  ExtraLarge = "extraLarge",
}

export enum PieceAlignment {
  Center = "center",
  Bottom = "bottom",
}

function getPieceImagePath(
  suit: SuitType,
  rank: number,
  faceDown: boolean,
  isRed?: boolean,
) {
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
  if (size === PieceSize.Medium) {
    return rotation % 2 === 0 ? "w-9 h-12" : "w-12 h-9";
  }
  if (size === PieceSize.Large) {
    return rotation % 2 === 0 ? "w-12 h-16" : "w-16 h-12";
  }
  return rotation % 2 === 0 ? "w-14 h-18" : "w-18 h-14";
}

function getRotatedPaddingClass(
  rotation: number,
  size: PieceSize = PieceSize.Large,
) {
  if (rotation % 2 === 0) return "";
  if (size === PieceSize.Small) return "my-1";
  if (size === PieceSize.Medium) return "my-2";
  if (size === PieceSize.Large) return "my-3";
  return "my-4";
}

function getImageSizeClass(size: PieceSize = PieceSize.Large) {
  if (size === PieceSize.Small) return "w-6 h-8";
  if (size === PieceSize.Medium) return "w-9 h-12";
  if (size === PieceSize.Large) return "w-12 h-16";
  return "w-14 h-18";
}

function getAlignmentClass(alignment: PieceAlignment, rotation: number) {
  // Only apply special alignment when rotated
  if (rotation % 2 === 0) return "items-center";

  // When rotated 90° or 270°, we need to invert the alignment
  // For bottom alignment on rotated pieces, we actually need to use 'items-start' (top alignment)
  // because after rotation, what was the bottom is now at the top
  return alignment === PieceAlignment.Bottom ? "items-start" : "items-center";
}

interface IPiece extends PieceType {
  rotation?: number;
  size?: PieceSize;
  animated?: boolean;
  alignment?: PieceAlignment;
}

export const Piece = ({
  suit,
  rank,
  rotation = 0,
  size = PieceSize.Large,
  animated = false,
  faceDown = false,
  alignment = PieceAlignment.Center,
}: IPiece) => (
  <motion.div
    whileHover={animated ? { bottom: 10 } : undefined}
    className={`relative ${getSizeClasses(
      rotation,
      size,
    )} ${getRotatedPaddingClass(rotation, size)}`}
  >
    <div
      className={`absolute inset-0 flex ${getAlignmentClass(alignment, rotation)} justify-center`}
    >
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
