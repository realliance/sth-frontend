import { iso31661, ISO31661AssignedEntry } from "iso-3166";

const PRIDE_COUNTRIES: ISO31661AssignedEntry[] = [
    {
        alpha2: "!!",
        alpha3: "_AG",
        name: "Agender",
        numeric: "pride-000",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_AN",
        name: "Androgyne",
        numeric: "pride-001",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_AR",
        name: "Aromantic",
        numeric: "pride-002",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_AS",
        name: "Asexual",
        numeric: "pride-003",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_BE",
        name: "Bear",
        numeric: "pride-004",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_BG",
        name: "Bigender",
        numeric: "pride-005",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_BI",
        name: "Bisexual",
        numeric: "pride-006",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_DG",
        name: "Demigirl",
        numeric: "pride-007",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_DM",
        name: "Demiguy",
        numeric: "pride-008",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_DN",
        name: "Deminonbinary",
        numeric: "pride-009",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_DS",
        name: "Demisexual",
        numeric: "pride-010",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_EN",
        name: "Enbian",
        numeric: "pride-011",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_GM",
        name: "Gay Man",
        numeric: "pride-012",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_GF",
        name: "Genderfluid",
        numeric: "pride-013",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_GQ",
        name: "Genderqueer",
        numeric: "pride-014",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_IN",
        name: "Intersex",
        numeric: "pride-015",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_LE",
        name: "Leather",
        numeric: "pride-016",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_LB",
        name: "Lesbian",
        numeric: "pride-017",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_LU",
        name: "Lunaric",
        numeric: "pride-018",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_ME",
        name: "Mercuric",
        numeric: "pride-019",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_NE",
        name: "Neutrois",
        numeric: "pride-020",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_NB",
        name: "Nonbinary",
        numeric: "pride-021",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_OM",
        name: "Omnisexual",
        numeric: "pride-022",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_PA",
        name: "Pansexual",
        numeric: "pride-023",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_PO",
        name: "Polyamory",
        numeric: "pride-024",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_PS",
        name: "Polysexual",
        numeric: "pride-025",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_QU",
        name: "Quoiromantic",
        numeric: "pride-026",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_RA",
        name: "Rainbow",
        numeric: "pride-027",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_SO",
        name: "Solaric",
        numeric: "pride-028",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_ST",
        name: "Stellaric",
        numeric: "pride-029",
        state: "assigned",
    },
    {
        alpha2: "!!",
        alpha3: "_TR",
        name: "Transgender",
        numeric: "pride-030",
        state: "assigned",
    }
];

const EXTENDED_COUNTRIES: ISO31661AssignedEntry[] = [
    ...iso31661,
    ...PRIDE_COUNTRIES,
];

export interface CountryIcon {
    country: ISO31661AssignedEntry;
    emoji?: string;
    imagePath?: string;
}

export const COUNTRIES_WITH_ICONS: CountryIcon[] = EXTENDED_COUNTRIES.map((country) => {
    const emoji = country.alpha2 && country.alpha2 !== "!!" 
        ? String.fromCodePoint(
            ...[...country.alpha2.toUpperCase()]
                .map((char) => 127397 + char.charCodeAt(0))
          )
        : undefined;
    
    const imagePath = country.alpha2 === "!!" 
        ? `/assets/mutantstandard/flags/${country.name.toLowerCase().replace(/\s+/g, '_')}_flag.svg`
        : undefined;

    return {
        country,
        emoji,
        imagePath,
    };
});

export const getCountryByAlpha3 = (alpha3: string): CountryIcon | undefined => {
    return COUNTRIES_WITH_ICONS.find(c => c.country.alpha3 === alpha3);
};

export const getCountryByAlpha2 = (alpha2: string): CountryIcon | undefined => {
    return COUNTRIES_WITH_ICONS.find(c => c.country.alpha2 === alpha2);
};
