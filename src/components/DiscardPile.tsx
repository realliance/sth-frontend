import { Player, MeldGroup } from "../models/Player";
import { Wind } from "../models/Wind";
import { Piece, PieceSize } from "./Piece";
import { PieceMeld, MeldOrientation } from "./PieceMeld";
import { useBreakpointAtLeast } from "../hooks";

interface DiscardPileProps {
  wind?: Wind;
  player: Player;
  melds?: MeldGroup[]; // Using the MeldGroup from Player model
}

export const DiscardPile = ({ player, wind, melds = [] }: DiscardPileProps) => {
  // Use the breakpoint hook to determine if we're at medium screens or larger
  const isMediumScreen = useBreakpointAtLeast("lg");

  // Determine the appropriate tile size and gap based on screen size
  const tileSize = isMediumScreen ? PieceSize.Large : PieceSize.Medium;
  const gapSize = isMediumScreen ? "gap-3" : "gap-2";

  return (
    <div className="mt-1 w-full">
      {/* Header with wind and melds - fixed height container */}
      <div className="h-10 flex items-end mb-1 justify-between w-full">
        {/* Wind indicator */}
        {wind && <p className="text-xl font-bold">{wind}</p>}

        {/* Melds display - right aligned */}
        <div className="flex gap-2 items-end justify-start">
          {melds.length > 0 &&
            melds.map((meld, meldIndex) => (
              <PieceMeld
                key={meldIndex}
                pieces={meld.pieces}
                type={meld.type}
                orientation={meld.orientation || MeldOrientation.Right}
                size={PieceSize.Small}
                animated={false}
              />
            ))}
        </div>
      </div>

      {/* Single responsive grid with dynamic tile size and gap */}
      <div className={`grid grid-cols-7 ${gapSize} w-full`}>
        {player.discardPile.map((piece, index) => (
          <Piece {...piece} key={index} size={tileSize} />
        ))}
      </div>
    </div>
  );
};
