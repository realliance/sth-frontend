import { PieceType, SuitType } from "../models/Piece";
import { Player } from "../models/Player";
import { Wind } from "../models/Wind";
import { DiscardPile } from "./DiscardPile";
import { PlayerHand } from "./PlayerHand";
import { RoundPanel } from "./RoundPanel";
import { ScorePanel } from "./ScorePanel";

type GametablePlayers = {
  [Wind.East]: Player;
  [Wind.South]: Player;
  [Wind.West]: Player;
  [Wind.North]: Player;
};

interface GametableProps {
  seatPerspective: Wind;
  perspectiveHand: PieceType[];
  wind: Wind;
  players: GametablePlayers;
}

export const Gametable = ({
  seatPerspective,
  perspectiveHand,
  wind,
  players,
}: GametableProps) => {
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
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 flex flex-col justify-between w-full">
        <div className="flex flex-row justify-between w-full py-6 gap-8">
          <div className="w-1/3">
            <DiscardPile
              player={players[leftPlayer]}
              wind={leftPlayer}
              melds={players[leftPlayer].melds}
            />
          </div>
          <div className="w-1/3">
            <DiscardPile
              player={players[oppositePlayer]}
              wind={oppositePlayer}
              melds={players[oppositePlayer].melds}
            />
          </div>
          <div className="w-1/3">
            <DiscardPile
              player={players[rightPlayer]}
              wind={rightPlayer}
              melds={players[rightPlayer].melds}
            />
          </div>
        </div>

        <div className="flex flex-row w-full py-6 justify-between">
          <div className="basis-1/3 flex justify-start">
            <RoundPanel
              roundWind={wind}
              roundNumber={1}
              wallTilesRemaining={144}
              honbaSticks={0}
              riichiSticks={0}
              maxDoraTiles={5}
              doraTiles={[
                {
                  suit: SuitType.Pin,
                  rank: 1,
                },
              ]}
            />
          </div>

          <div className="basis-1/3">
            <DiscardPile
              player={players[seatPerspective]}
              wind={seatPerspective}
              melds={players[seatPerspective].melds}
            />
          </div>

          <div className="basis-1/3 flex justify-end">
            <ScorePanel players={players} dealerWind={Wind.East} />
          </div>
        </div>

        <div className="w-full py-6 flex justify-center">
          <PlayerHand pieces={perspectiveHand} />
        </div>
      </div>
    </div>
  );
};
