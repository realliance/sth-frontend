import React, { useState, useEffect } from "react";
import { authService } from "../../services/auth.service";
import type { CreateUserRequest } from "../../types/api";
import { Link } from "../../components/Link";
import { MdError } from "react-icons/md";
import { CountryDropdown } from "../../components/CountryDropdown";
import type { CountryIcon } from "../../lib/models/Countries";
import { getCountryByAlpha2 } from "../../lib/models/Countries";
import Avatar from "../../components/Avatar";
import type { PieceType } from "../../lib/models/Piece";
import { SuitType } from "../../lib/models/Piece";
import { PieceSize } from "../../components/Piece";
import { TileSelector } from "../../components/TileSelector";

const TILE_OPTIONS = [
  "1m",
  "2m",
  "3m",
  "4m",
  "5m",
  "6m",
  "7m",
  "8m",
  "9m",
  "1p",
  "2p",
  "3p",
  "4p",
  "5p",
  "6p",
  "7p",
  "8p",
  "9p",
  "1s",
  "2s",
  "3s",
  "4s",
  "5s",
  "6s",
  "7s",
  "8s",
  "9s",
  "east",
  "south",
  "west",
  "north",
  "white",
  "green",
  "red",
];

const tileStringToPiece = (tileStr: string): PieceType => {
  if (
    ["east", "south", "west", "north", "white", "green", "red"].includes(
      tileStr,
    )
  ) {
    const honorRanks = {
      red: 0,
      white: 1,
      green: 2,
      north: 3,
      south: 4,
      east: 5,
      west: 6,
    };
    return {
      suit: SuitType.Honor,
      rank: honorRanks[tileStr as keyof typeof honorRanks],
    };
  }

  const rank = parseInt(tileStr[0]);
  const suitChar = tileStr[1];
  const suitMap = { m: SuitType.Man, p: SuitType.Pin, s: SuitType.Sou };

  return { suit: suitMap[suitChar as keyof typeof suitMap], rank };
};

const detectCountryFromLocale = (): CountryIcon | undefined => {
  if (typeof navigator !== "undefined") {
    const locale = navigator.language || navigator.languages?.[0];
    if (locale) {
      const parts = locale.split("-");
      if (parts.length > 1) {
        const countryCode = parts[parts.length - 1].toUpperCase();
        return getCountryByAlpha2(countryCode);
      }
    }
  }
  return undefined;
};

export default function RegisterPage() {
  const getRandomTile = () =>
    TILE_OPTIONS[Math.floor(Math.random() * TILE_OPTIONS.length)];

  const detectedCountry = detectCountryFromLocale();
  const initialCountry = detectedCountry ? detectedCountry.country.alpha3 : "";

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    password: "",
    country: initialCountry,
    email: "",
    pronouns: "",
    favorite_tile: getRandomTile(),
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<
    CountryIcon | undefined
  >(detectedCountry || undefined);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleCountryChange = (country: CountryIcon) => {
    setSelectedCountry(country);
    setFormData((prev) => ({
      ...prev,
      country: country.country.alpha3,
    }));
  };

  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      formData.favorite_tile !== "" &&
      formData.password === confirmPassword
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authService.register(formData);
      // Redirect to login page on successful registration
      window.location.href = "/login?registered=true";
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-8">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {formData.favorite_tile && (
            <div className="flex justify-center my-2">
              <Avatar
                piece={tileStringToPiece(formData.favorite_tile)}
                size={PieceSize.ExtraLarge}
                flag={
                  selectedCountry ||
                  getCountryByAlpha2("AD") ||
                  selectedCountry!
                }
              />
            </div>
          )}
          <div className="text-center my-2">
            <h1 className="text-2xl font-bold text-primary">
              Small Turtle House
            </h1>
            <p className="text-sm text-base-content/60">Create your profile</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-error mb-8">
                <MdError className="w-6 h-6" />
                <span>{error}</span>
              </div>
            )}

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control flex flex-col gap-1">
                  <label className="label">
                    <span className="label-text">Flag</span>
                  </label>
                  <CountryDropdown
                    selectedCountry={selectedCountry}
                    onCountryChange={handleCountryChange}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Favorite Tile *</span>
                  </label>
                  <TileSelector
                    selectedTile={formData.favorite_tile || ""}
                    onTileSelect={(tile) => {
                      setFormData((prev) => ({
                        ...prev,
                        favorite_tile: tile,
                      }));
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username *</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Pronouns</span>
                  </label>
                  <input
                    type="text"
                    name="pronouns"
                    value={formData.pronouns || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="e.g., they/them, he/him, she/her"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your email (optional)"
                    disabled={isLoading}
                  />
                  <div className="label">
                    <span className="label-text-alt text-base-content/60">
                      Emails will only be used to notify of moderation activity
                      on your account
                    </span>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password *</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="fieldset mb-6">
              <div className="fieldset-content">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm Password *</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </fieldset>

            <div className="form-control mt-8">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm text-base-content/60">
              Already have an account?{" "}
              <Link href="/login" className="link link-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
