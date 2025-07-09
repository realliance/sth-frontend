import { useMemo, useState } from "react";
import { COUNTRIES_WITH_ICONS, CountryIcon } from "../lib/models/Countries";

interface ICountryItem {
  c: CountryIcon;
  onCountryChange: (country: CountryIcon) => void;
}

const CountryItem = ({ c, onCountryChange }: ICountryItem) => (
  <li>
    <a
      className="flex items-center gap-2"
      onClick={(e) => {
        e.preventDefault();
        if (onCountryChange) {
          onCountryChange(c);
        }
      }}
    >
      {c.imagePath ? (
        <img src={c.imagePath} alt={c.country.name} className="w-6 h-6" />
      ) : (
        <span>{c.emoji}</span>
      )}
      {c.country.name}
    </a>
  </li>
);

interface CountryDropdownProps {
  selectedCountry?: CountryIcon;
  onCountryChange: (country: CountryIcon) => void;
}

export const CountryDropdown = ({
  selectedCountry,
  onCountryChange,
}: CountryDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const countries = useMemo(() => {
    const filtered = COUNTRIES_WITH_ICONS.filter((c) =>
      c.country.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (filtered.length === 0) {
      return [
        <li key="no-results">
          <div className="text-center py-4 text-base-content/60">
            No countries found for "{searchTerm}"
          </div>
        </li>,
      ];
    }

    return filtered.map((c) => (
      <CountryItem
        key={c.country.alpha3}
        c={c}
        onCountryChange={onCountryChange}
      />
    ));
  }, [onCountryChange, searchTerm]);

  return (
    <div className="dropdown min-w-[200px]">
      <div tabIndex={0} role="button" className="btn w-full justify-start">
        {selectedCountry ? (
          <div className="flex items-center gap-2">
            {selectedCountry.imagePath ? (
              <img
                src={selectedCountry.imagePath}
                alt={selectedCountry.country.name}
                className="w-6 h-6"
              />
            ) : (
              <span>{selectedCountry.emoji}</span>
            )}
            {selectedCountry.country.name}
          </div>
        ) : (
          "Choose your Flag"
        )}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
      >
        <div className="p-2 sticky top-0 bg-base-100 border-b">
          <input
            type="text"
            placeholder="Search countries..."
            className="input input-bordered input-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-64 overflow-y-auto">{countries}</div>
      </ul>
    </div>
  );
};
