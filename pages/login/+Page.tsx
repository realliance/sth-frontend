import React, { useState } from 'react';
import { authService } from '../../services/auth.service';
import { Link } from '../../components/Link';
import { MdError } from 'react-icons/md';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(formData.username, formData.password);
      // Redirect to home page on successful login
      window.location.href = '/';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Small Turtle House</h1>
            <p className="text-sm text-base-content/60">Sign in to your account</p>
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
                <span className="label-text">Username</span>
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
                <span className="label-text">Password</span>
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

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <div className="text-center">
            <p className="text-sm text-base-content/60">
              Don't have an account?{' '}
              <Link href="/register" className="link link-primary">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}