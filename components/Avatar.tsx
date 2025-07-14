import { CountryIcon } from "../lib/models/Countries";
import { PieceType } from "../lib/models/Piece";
import { Piece, PieceSize } from "./Piece";

interface AvatarProps {
  piece: PieceType;
  flag: CountryIcon;
  size?: PieceSize;
}

export default ({ piece, flag, size = PieceSize.Large }: AvatarProps) => {
  const getFlagSizeClasses = () => {
    switch (size) {
      case PieceSize.Small:
        return { img: "w-4 h-4", emoji: "text-base" };
      case PieceSize.Medium:
        return { img: "w-5 h-5", emoji: "text-lg" };
      case PieceSize.Large:
        return { img: "w-6 h-6", emoji: "text-xl" };
      case PieceSize.ExtraLarge:
        return { img: "w-8 h-8", emoji: "text-2xl" };
    }
  };

  const flagSizes = getFlagSizeClasses();

  return (
    <div className="relative inline-block">
      <Piece {...piece} size={size} />
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/3 z-100">
        {flag.imagePath ? (
          <img
            src={flag.imagePath}
            alt={flag.country.name}
            className={`${flagSizes.img} shadow-sm`}
          />
        ) : (
          <span className={`${flagSizes.emoji} shadow-sm`}>{flag.emoji}</span>
        )}
      </div>
    </div>
  );
};
