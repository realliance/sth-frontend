import type { Lobby } from '../types/api';

export interface LobbyService {
  getAllLobbies(): Promise<Lobby[]>;
  joinQueue(lobbyId: string): Promise<void>;
  leaveQueue(lobbyId: string): Promise<void>;
}

export class LobbyServiceImpl implements LobbyService {
  constructor(
    private apiBaseUrl: string = typeof window === 'undefined' ? 'http://localhost:8080/v1' : '/v1'
  ) {}

  async getAllLobbies(): Promise<Lobby[]> {
    const response = await fetch(`${this.apiBaseUrl}/all-lobbies`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch lobbies');
    }

    return await response.json();
  }

  async joinQueue(lobbyId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/lobbies/${lobbyId}/queue`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to join queue');
    }
  }

  async leaveQueue(lobbyId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/lobbies/${lobbyId}/queue`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to leave queue');
    }
  }
}

// Export singleton instance for production use
export const lobbyService = new LobbyServiceImpl();