import { Player } from "../models/Player";
import { Wind } from "../models/Wind";
import { Piece } from "./Piece";

interface DiscardPileProps {
  wind?: Wind;
  rotation?: number;
  player: Player;
}

function getGridClasses(rotation: number) {
  return rotation % 2 === 0 ? "grid-cols-7" : "grid-rows-7";
}

export const DiscardPile = ({ rotation, player, wind }: DiscardPileProps) => (
  <div>
    {wind && <p>{wind}</p>}
    <div className={`grid gap-2 ${getGridClasses(rotation || 0)}`}>
      {player.discardPile.map((piece, index) => (
        <Piece {...piece} key={index} rotation={rotation || 0} />
      ))}
    </div>
  </div>
);
