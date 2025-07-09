import type { User, CreateUserRequest } from '../types/api';

export interface AuthService {
  getCurrentUser(cookie?: string): Promise<User | null>;
  login(username: string, password: string): Promise<User>;
  register(userData: CreateUserRequest): Promise<User>;
  logout(): Promise<void>;
}

export class AuthServiceImpl implements AuthService {
  constructor(
    private apiBaseUrl: string = typeof window === 'undefined' ? 'http://localhost:8080/v1' : '/v1'
  ) {}

  async getCurrentUser(cookie?: string): Promise<User | null> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (cookie) {
        headers['Cookie'] = cookie;
      }

      const response = await fetch(`${this.apiBaseUrl}/auth/me`, {
        credentials: 'include',
        headers,
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data.user;
  }

  async register(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${this.apiBaseUrl}/users`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      if (response.status === 400) {
        throw new Error('Username already exists');
      }
      throw new Error(error.message || 'Registration failed');
    }

    return await response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  }
}

// Export singleton instance for production use
export const authService = new AuthServiceImpl();