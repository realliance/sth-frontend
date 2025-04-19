import { PieceType } from "../models/Piece";
import { Wind } from "../models/Wind";
import { DiscardPile } from "./DiscardPile";
import { PlayerHand } from "./PlayerHand";

type GametableDiscardPiles = {
  [Wind.East]: PieceType[];
  [Wind.South]: PieceType[];
  [Wind.West]: PieceType[];
  [Wind.North]: PieceType[];
};

interface GametableProps {
  seatPerspective: Wind;
  perspectiveHand: PieceType[];
  wind: Wind;
  discardPiles: GametableDiscardPiles;
}

export const Gametable = ({
  seatPerspective,
  perspectiveHand,
  wind,
  discardPiles,
}: GametableProps) => {
  // Calculate positions based on Riichi Mahjong seating order
  const getPlayerOnRight = (playerWind: Wind): Wind => {
    switch (playerWind) {
      case Wind.East:
        return Wind.South;
      case Wind.South:
        return Wind.West;
      case Wind.West:
        return Wind.North;
      case Wind.North:
        return Wind.East;
    }
  };

  const getPlayerOpposite = (playerWind: Wind): Wind => {
    switch (playerWind) {
      case Wind.East:
        return Wind.West;
      case Wind.South:
        return Wind.North;
      case Wind.West:
        return Wind.East;
      case Wind.North:
        return Wind.South;
    }
  };

  const getPlayerOnLeft = (playerWind: Wind): Wind => {
    switch (playerWind) {
      case Wind.East:
        return Wind.North;
      case Wind.South:
        return Wind.East;
      case Wind.West:
        return Wind.South;
      case Wind.North:
        return Wind.West;
    }
  };

  const rightPlayer = getPlayerOnRight(seatPerspective);
  const oppositePlayer = getPlayerOpposite(seatPerspective);
  const leftPlayer = getPlayerOnLeft(seatPerspective);

  return (
    <div className="flex flex-col items-center justify-between h-full">
      <div className="flex flex-row justify-between w-full">
        <DiscardPile pieces={discardPiles[leftPlayer]} wind={leftPlayer} />
        <DiscardPile
          pieces={discardPiles[oppositePlayer]}
          wind={oppositePlayer}
        />
        <DiscardPile pieces={discardPiles[rightPlayer]} wind={rightPlayer} />
      </div>

      <DiscardPile
        pieces={discardPiles[seatPerspective]}
        wind={seatPerspective}
      />
      <PlayerHand pieces={perspectiveHand} />
    </div>
  );
};
