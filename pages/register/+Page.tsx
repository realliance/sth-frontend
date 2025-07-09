import React, { useState } from "react";
import { authService } from "../../services/auth.service";
import type { CreateUserRequest } from "../../types/api";
import { Link } from "../../components/Link";
import { MdError } from "react-icons/md";
import { iso31661 } from "iso-3166";
import { CountryDropdown } from "../../components/CountryDropdown";
import type { CountryIcon } from "../../lib/models/Countries";
import { getCountryByAlpha3 } from "../../lib/models/Countries";

export default function RegisterPage() {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    password: "",
    country: "",
    email: "",
    pronouns: "",
    favorite_tile: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<
    CountryIcon | undefined
  >(formData.country ? getCountryByAlpha3(formData.country) : undefined);

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
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">
              Small Turtle House
            </h1>
            <p className="text-sm text-base-content/60">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="alert alert-error">
                <MdError className="w-6 h-6" />
                <span>{error}</span>
              </div>
            )}

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

            <div className="form-control flex flex-col gap-1">
              <label className="label">
                <span className="label-text">Flag</span>
              </label>
              <CountryDropdown
                selectedCountry={selectedCountry}
                onCountryChange={handleCountryChange}
              />
            </div>

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
            </div>

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

            <div className="form-control">
              <label className="label">
                <span className="label-text">Favorite Tile</span>
              </label>
              <select
                name="favorite_tile"
                value={formData.favorite_tile || ""}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                disabled={isLoading}
              >
                <option value="">Select your favorite tile (optional)</option>
                <option value="1m">1 Man</option>
                <option value="2m">2 Man</option>
                <option value="3m">3 Man</option>
                <option value="4m">4 Man</option>
                <option value="5m">5 Man</option>
                <option value="6m">6 Man</option>
                <option value="7m">7 Man</option>
                <option value="8m">8 Man</option>
                <option value="9m">9 Man</option>
                <option value="1p">1 Pin</option>
                <option value="2p">2 Pin</option>
                <option value="3p">3 Pin</option>
                <option value="4p">4 Pin</option>
                <option value="5p">5 Pin</option>
                <option value="6p">6 Pin</option>
                <option value="7p">7 Pin</option>
                <option value="8p">8 Pin</option>
                <option value="9p">9 Pin</option>
                <option value="1s">1 Sou</option>
                <option value="2s">2 Sou</option>
                <option value="3s">3 Sou</option>
                <option value="4s">4 Sou</option>
                <option value="5s">5 Sou</option>
                <option value="6s">6 Sou</option>
                <option value="7s">7 Sou</option>
                <option value="8s">8 Sou</option>
                <option value="9s">9 Sou</option>
                <option value="east">East Wind</option>
                <option value="south">South Wind</option>
                <option value="west">West Wind</option>
                <option value="north">North Wind</option>
                <option value="white">White Dragon</option>
                <option value="green">Green Dragon</option>
                <option value="red">Red Dragon</option>
              </select>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
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
