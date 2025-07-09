import type { GameStats, User } from '../types/api';

export interface LeaderboardEntry {
  id: string;
  username: string;
  rating: number;
  rank: number;
  gamesPlayed: number;
  winRate: number;
}

export interface StatsService {
  getUserStats(userId?: string): Promise<GameStats>;
  getPlayerLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
  getBotLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}

export class StatsServiceImpl implements StatsService {
  constructor(
    private apiBaseUrl: string = typeof window === 'undefined' ? 'http://localhost:8080/v1' : '/v1'
  ) {}

  async getUserStats(userId?: string): Promise<GameStats> {
    const endpoint = userId ? `/users/${userId}/stats` : '/stats/me';
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user stats');
    }

    return await response.json();
  }

  async getPlayerLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.apiBaseUrl}/leaderboards?type=player&limit=${limit}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch player leaderboard');
    }

    return await response.json();
  }

  async getBotLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.apiBaseUrl}/leaderboards?type=bot&limit=${limit}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bot leaderboard');
    }

    return await response.json();
  }
}

export const statsService = new StatsServiceImpl();