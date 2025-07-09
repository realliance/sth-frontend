import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthServiceImpl } from '../auth.service';
import type { User } from '../../types/api';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('AuthService', () => {
  let authService: AuthServiceImpl;
  const mockUser: User = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    rating: 1500,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  };

  beforeEach(() => {
    authService = new AuthServiceImpl('http://localhost:3000/v1');
    vi.clearAllMocks();
  });

  describe('getCurrentUser', () => {
    it('should return user when authenticated', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authService.getCurrentUser('session-cookie');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'session-cookie',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when not authenticated', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });

    it('should handle network errors gracefully', async () => {
      (globalThis.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return user on successful login', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      const result = await authService.login('testuser', 'password');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser', password: 'password' }),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error on failed login', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      });

      await expect(authService.login('testuser', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should complete successfully', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await expect(authService.logout()).resolves.not.toThrow();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    });

    it('should throw error on failed logout', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(authService.logout()).rejects.toThrow('Logout failed');
    });
  });
});