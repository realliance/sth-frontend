import { Gametable } from "./components/Gametable";
import { Wind } from "./models/Wind";
import { generatePieces, generatePlayers } from "./util/lorumPieces";

function App() {
  const players = generatePlayers();

  const hand = generatePieces(13);

  return (
    <>
      <div className="h-screen p-4">
        <Gametable
          seatPerspective={Wind.East}
          perspectiveHand={hand}
          wind={Wind.East}
          players={players}
        />
      </div>
    </>
  );
}

export default App;
