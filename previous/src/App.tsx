import { Gametable } from "./components/Gametable";
import { Header } from "./components/Header";
import { Wind } from "./models/Wind";
import { generatePieces, generatePlayers } from "./util/lorumPieces";
import { SuitType } from "./models/Piece";
import { MeldType, MeldOrientation } from "./components/PieceMeld";

function App() {
  const players = generatePlayers();
  const hand = generatePieces(13);

  // Add some sample melds to each player
  const sampleMelds = {
    // Three of a kind (pon) - Man suit
    tripletMan: {
      type: MeldType.ThreePiece,
      pieces: [
        { suit: SuitType.Man, rank: 5 },
        { suit: SuitType.Man, rank: 5 },
        { suit: SuitType.Man, rank: 5 },
      ],
      orientation: MeldOrientation.Right,
    },
    // Straight (chi) - Pin suit
    straightPin: {
      type: MeldType.ThreePiece,
      pieces: [
        { suit: SuitType.Pin, rank: 3 },
        { suit: SuitType.Pin, rank: 4 },
        { suit: SuitType.Pin, rank: 5 },
      ],
      orientation: MeldOrientation.Left,
    },
    // Four of a kind (kan) - Sou suit
    kanSou: {
      type: MeldType.FourPieceConverted,
      pieces: [
        { suit: SuitType.Sou, rank: 7 },
        { suit: SuitType.Sou, rank: 7 },
        { suit: SuitType.Sou, rank: 7 },
        { suit: SuitType.Sou, rank: 7 },
      ],
      orientation: MeldOrientation.Middle,
    },
    // Concealed kan - Honor tiles
    concealedKan: {
      type: MeldType.FourPieceConcealed,
      pieces: [
        { suit: SuitType.Honor, rank: 0 },
        { suit: SuitType.Honor, rank: 0 },
        { suit: SuitType.Honor, rank: 0 },
        { suit: SuitType.Honor, rank: 0 },
      ],
    },
  };

  // Assign different melds to each player
  const playersWithMelds = {
    ...players,
    [Wind.East]: {
      ...players[Wind.East],
      melds: [sampleMelds.tripletMan, sampleMelds.straightPin],
    },
    [Wind.South]: {
      ...players[Wind.South],
      melds: [sampleMelds.kanSou],
    },
    [Wind.West]: {
      ...players[Wind.West],
      melds: [sampleMelds.concealedKan, sampleMelds.tripletMan],
    },
    [Wind.North]: {
      ...players[Wind.North],
      melds: [
        sampleMelds.straightPin,
        sampleMelds.kanSou,
        sampleMelds.tripletMan,
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-slate-100 flex flex-col">
      <Header />
      <div className="container mx-auto px-4 flex-1 overflow-auto">
        <Gametable
          seatPerspective={Wind.East}
          perspectiveHand={hand}
          wind={Wind.East}
          players={playersWithMelds}
        />
      </div>
    </div>
  );
}

export default App;
