import type { Bot } from '../types/api';

export interface BotService {
  getBots(): Promise<Bot[]>;
  getBot(id: string): Promise<Bot>;
  createBot(data: { name: string; description?: string }): Promise<Bot>;
  updateBot(id: string, data: Partial<{ name: string; description: string; status: string }>): Promise<Bot>;
  deleteBot(id: string): Promise<void>;
  joinQueue(botId: string, lobbyId: string): Promise<void>;
  leaveQueue(botId: string): Promise<void>;
}

export class BotServiceImpl implements BotService {
  constructor(
    private apiBaseUrl: string = typeof window === 'undefined' ? 'http://localhost:8080/v1' : '/v1'
  ) {}

  async getBots(): Promise<Bot[]> {
    const response = await fetch(`${this.apiBaseUrl}/bots`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bots');
    }

    return await response.json();
  }

  async getBot(id: string): Promise<Bot> {
    const response = await fetch(`${this.apiBaseUrl}/bots/${id}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bot');
    }

    return await response.json();
  }

  async createBot(data: { name: string; description?: string }): Promise<Bot> {
    const response = await fetch(`${this.apiBaseUrl}/bots`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create bot');
    }

    return await response.json();
  }

  async updateBot(id: string, data: Partial<{ name: string; description: string; status: string }>): Promise<Bot> {
    const response = await fetch(`${this.apiBaseUrl}/bots/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update bot');
    }

    return await response.json();
  }

  async deleteBot(id: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/bots/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete bot');
    }
  }

  async joinQueue(botId: string, lobbyId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/queue/join-bot`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botId, lobbyId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to join bot to queue');
    }
  }

  async leaveQueue(botId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/queue/leave-bot`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ botId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove bot from queue');
    }
  }
}

export const botService = new BotServiceImpl();