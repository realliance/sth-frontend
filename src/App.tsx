import { Gametable } from "./components/Gametable";
import { PlayerHand } from "./components/PlayerHand";
import { Wind } from "./models/Wind";
import { generatePieces } from "./util/lorumPieces";

function App() {
  const discardPiles = {
    [Wind.East]: generatePieces(15),
    [Wind.South]: generatePieces(15),
    [Wind.West]: generatePieces(15),
    [Wind.North]: generatePieces(15),
  };

  const hand = generatePieces(13);

  return (
    <>
      <div className="h-screen p-4">
        <Gametable
          seatPerspective={Wind.East}
          perspectiveHand={hand}
          wind={Wind.East}
          discardPiles={discardPiles}
        />
      </div>
    </>
  );
}

export default App;
