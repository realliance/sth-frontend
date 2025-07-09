import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LobbyServiceImpl } from '../lobby.service';
import type { Lobby } from '../../types/api';

// Mock fetch globally
globalThis.fetch = vi.fn();

describe('LobbyService', () => {
  let lobbyService: LobbyServiceImpl;
  const mockLobbies: Lobby[] = [
    {
      id: '1',
      name: 'Beginner Lobby',
      description: 'For new players',
      queueSize: 3,
      activeGames: 5,
      minRating: 0,
      maxRating: 1000,
      preset: {
        id: 'beginner',
        name: 'Beginner',
        settings: {},
      },
    },
    {
      id: '2',
      name: 'Advanced Lobby',
      description: 'For experienced players',
      queueSize: 1,
      activeGames: 12,
      minRating: 1500,
      maxRating: null,
      preset: {
        id: 'advanced',
        name: 'Advanced',
        settings: {},
      },
    },
  ];

  beforeEach(() => {
    lobbyService = new LobbyServiceImpl('http://localhost:3000/v1');
    vi.clearAllMocks();
  });

  describe('getAllLobbies', () => {
    it('should return all lobbies', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockLobbies,
      });

      const result = await lobbyService.getAllLobbies();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/all-lobbies', {
        credentials: 'include',
      });
      expect(result).toEqual(mockLobbies);
    });

    it('should throw error when fetch fails', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(lobbyService.getAllLobbies()).rejects.toThrow('Failed to fetch lobbies');
    });
  });

  describe('joinQueue', () => {
    it('should join queue successfully', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await expect(lobbyService.joinQueue('lobby-1')).resolves.not.toThrow();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/lobbies/lobby-1/queue', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
    });

    it('should throw error when join fails', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Lobby is full' }),
      });

      await expect(lobbyService.joinQueue('lobby-1')).rejects.toThrow('Lobby is full');
    });
  });

  describe('leaveQueue', () => {
    it('should leave queue successfully', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: true,
      });

      await expect(lobbyService.leaveQueue('lobby-1')).resolves.not.toThrow();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/v1/lobbies/lobby-1/queue', {
        method: 'DELETE',
        credentials: 'include',
      });
    });

    it('should throw error when leave fails', async () => {
      (globalThis.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(lobbyService.leaveQueue('lobby-1')).rejects.toThrow('Failed to leave queue');
    });
  });
});