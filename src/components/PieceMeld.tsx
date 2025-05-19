import React from "react";
import { Piece, PieceSize, PieceAlignment } from "./Piece";
import { PieceType } from "../models/Piece";

export enum MeldType {
  ThreePiece = "threePiece",
  FourPieceConverted = "fourPieceConverted",
  FourPieceConcealed = "fourPieceConcealed",
}

export enum MeldOrientation {
  Left = "left",
  Middle = "middle",
  Right = "right",
}

interface PieceMeldProps {
  pieces: PieceType[];
  type: MeldType;
  orientation?: MeldOrientation;
  size?: PieceSize;
  animated?: boolean;
}

export const PieceMeld: React.FC<PieceMeldProps> = ({
  pieces,
  type,
  orientation = MeldOrientation.Right,
  size = PieceSize.Medium,
  animated = false,
}) => {
  // Function to determine correct alignment based on rotation
  const getAlignmentForRotation = (rotation: number): PieceAlignment => {
    // If rotation is 0 or 180 (vertical), use center alignment
    // If rotation is 90 or 270 (horizontal), use bottom alignment
    return rotation % 2 === 0 ? PieceAlignment.Center : PieceAlignment.Bottom;
  };

  const renderThreePieceMeld = () => {
    let leftRotation = 0;
    let middleRotation = 0;
    let rightRotation = 0;

    switch (orientation) {
      case MeldOrientation.Left:
        leftRotation = 3;
        break;
      case MeldOrientation.Middle:
        middleRotation = 1;
        break;
      case MeldOrientation.Right:
        rightRotation = 1;
        break;
    }

    return (
      <div className="flex items-end gap-1">
        <Piece
          {...pieces[0]}
          rotation={leftRotation}
          size={size}
          animated={animated}
          alignment={getAlignmentForRotation(leftRotation)}
        />
        <Piece
          {...pieces[1]}
          rotation={middleRotation}
          size={size}
          animated={animated}
          alignment={getAlignmentForRotation(middleRotation)}
        />
        <Piece
          {...pieces[2]}
          rotation={rightRotation}
          size={size}
          animated={animated}
          alignment={getAlignmentForRotation(rightRotation)}
        />
      </div>
    );
  };

  const renderFourPieceConverted = () => {
    let leftRotation = 0;
    let middleRotation = 0;
    let rightRotation = 0;

    let stackPosition: "left" | "middle" | "right";

    switch (orientation) {
      case MeldOrientation.Left:
        leftRotation = 3;
        stackPosition = "left";
        break;
      case MeldOrientation.Middle:
        middleRotation = 1;
        stackPosition = "middle";
        break;
      default:
        rightRotation = 1;
        stackPosition = "right";
        break;
    }

    // Get an appropriate offset for the stacked pieces based on size
    const getOverlapClass = () => {
      switch (size) {
        case PieceSize.Small:
          return "bottom-[80%]";
        case PieceSize.Medium:
          return "bottom-[80%]";
        case PieceSize.Large:
          return "bottom-[85%]";
        case PieceSize.ExtraLarge:
          return "bottom-[90%]";
        default:
          return "bottom-[80%]";
      }
    };

    // Get top margin for the container based on size
    // Adjusted margins for better spacing
    const getTopMarginClass = () => {
      switch (size) {
        case PieceSize.Small:
          return "mt-2"; // Reduced from mt-6 to mt-2
        case PieceSize.Medium:
          return "mt-8";
        case PieceSize.Large:
          return "mt-10";
        case PieceSize.ExtraLarge:
          return "mt-12";
        default:
          return "mt-8";
      }
    };

    return (
      <div className={`flex items-end gap-1 ${getTopMarginClass()}`}>
        {stackPosition === "left" ? (
          <div className="relative">
            {/* Bottom tile */}
            <Piece
              {...pieces[0]}
              rotation={leftRotation}
              size={size}
              animated={animated}
              alignment={getAlignmentForRotation(leftRotation)}
            />
            {/* Top tile positioned from bottom */}
            <div className={`absolute left-0 ${getOverlapClass()}`}>
              <Piece
                {...pieces[3]}
                rotation={leftRotation}
                size={size}
                animated={animated}
                alignment={getAlignmentForRotation(leftRotation)}
              />
            </div>
          </div>
        ) : (
          <Piece
            {...pieces[0]}
            rotation={leftRotation}
            size={size}
            animated={animated}
            alignment={getAlignmentForRotation(leftRotation)}
          />
        )}

        {stackPosition === "middle" ? (
          <div className="relative">
            {/* Bottom tile */}
            <Piece
              {...pieces[1]}
              rotation={middleRotation}
              size={size}
              animated={animated}
              alignment={getAlignmentForRotation(middleRotation)}
            />
            {/* Top tile positioned from bottom */}
            <div className={`absolute left-0 ${getOverlapClass()}`}>
              <Piece
                {...pieces[3]}
                rotation={middleRotation}
                size={size}
                animated={animated}
                alignment={getAlignmentForRotation(middleRotation)}
              />
            </div>
          </div>
        ) : (
          <Piece
            {...pieces[1]}
            rotation={middleRotation}
            size={size}
            animated={animated}
            alignment={getAlignmentForRotation(middleRotation)}
          />
        )}

        {stackPosition === "right" ? (
          <div className="relative">
            {/* Bottom tile */}
            <Piece
              {...pieces[2]}
              rotation={rightRotation}
              size={size}
              animated={animated}
              alignment={getAlignmentForRotation(rightRotation)}
            />
            {/* Top tile positioned from bottom */}
            <div className={`absolute left-0 ${getOverlapClass()}`}>
              <Piece
                {...pieces[3]}
                rotation={rightRotation}
                size={size}
                animated={animated}
                alignment={getAlignmentForRotation(rightRotation)}
              />
            </div>
          </div>
        ) : (
          <Piece
            {...pieces[2]}
            rotation={rightRotation}
            size={size}
            animated={animated}
            alignment={getAlignmentForRotation(rightRotation)}
          />
        )}
      </div>
    );
  };

  const renderFourPieceConcealed = () => {
    return (
      <div className="flex items-end gap-1">
        <Piece
          {...pieces[0]}
          faceDown={true}
          size={size}
          animated={animated}
          alignment={PieceAlignment.Center}
        />
        <Piece
          {...pieces[1]}
          size={size}
          animated={animated}
          alignment={PieceAlignment.Center}
        />
        <Piece
          {...pieces[2]}
          size={size}
          animated={animated}
          alignment={PieceAlignment.Center}
        />
        <Piece
          {...pieces[3]}
          faceDown={true}
          size={size}
          animated={animated}
          alignment={PieceAlignment.Center}
        />
      </div>
    );
  };

  switch (type) {
    case MeldType.ThreePiece:
      return renderThreePieceMeld();
    case MeldType.FourPieceConverted:
      return renderFourPieceConverted();
    case MeldType.FourPieceConcealed:
      return renderFourPieceConcealed();
    default:
      return null;
  }
};
