import type { User, Lobby, Bot, Friend, FriendRequest, Notification, Room, GameStats, LoginRequest, LoginResponse } from '../types/api';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private serverCookie?: string;

  private getBaseUrl() {
    // On server-side, use full URL to API server
    if (typeof window === 'undefined') {
      return 'http://localhost:8080/v1';
    }
    // On client-side, use relative URL (proxy will handle it)
    return '/v1';
  }

  private defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Method to set server-side cookie for SSR
  setServerCookie(cookie: string) {
    this.serverCookie = cookie;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    
    const headers: HeadersInit = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Forward cookies during SSR
    if (typeof window === 'undefined' && this.serverCookie) {
      headers['Cookie'] = this.serverCookie;
    }
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important for cookie-based auth
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || `API Error: ${response.statusText}`,
          errorData
        );
      }

      // Handle empty responses
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout() {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request<User>('/auth/me');
  }

  // Lobby endpoints
  async getAllLobbies() {
    return this.request<Lobby[]>('/all-lobbies');
  }

  async joinQueue(lobbyId: string) {
    return this.request<any>(`/lobbies/${lobbyId}/queue`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async leaveQueue(lobbyId: string) {
    return this.request<void>(`/lobbies/${lobbyId}/queue`, {
      method: 'DELETE',
    });
  }

  // Bot endpoints
  async getBots() {
    return this.request<Bot[]>('/bots');
  }

  async getBot(id: string) {
    return this.request<Bot>(`/bots/${id}`);
  }

  async createBot(data: { name: string; description?: string }) {
    return this.request<Bot>('/bots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBot(id: string, data: Partial<{ name: string; description: string; status: string }>) {
    return this.request<Bot>(`/bots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBot(id: string) {
    return this.request<void>(`/bots/${id}`, {
      method: 'DELETE',
    });
  }

  // Friends endpoints
  async getFriends() {
    return this.request<Friend[]>('/friends');
  }

  async getFriendRequests() {
    return this.request<FriendRequest[]>('/friends/requests');
  }

  async sendFriendRequest(userId: string) {
    return this.request<FriendRequest>('/friends/requests', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async acceptFriendRequest(requestId: string) {
    return this.request<FriendRequest>(`/friends/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'accept' }),
    });
  }

  async rejectFriendRequest(requestId: string) {
    return this.request<FriendRequest>(`/friends/requests/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ action: 'reject' }),
    });
  }

  async removeFriend(friendId: string) {
    return this.request<void>(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // Stats endpoints
  async getUserStats(userId?: string) {
    const endpoint = userId ? `/users/${userId}/stats` : '/stats/me';
    return this.request<GameStats>(endpoint);
  }

  async getLeaderboards(type: 'player' | 'bot' = 'player') {
    return this.request<any[]>(`/leaderboards?type=${type}`);
  }

  // Admin endpoints
  async getAuditLogs(params?: any) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<any[]>(`/admin/audit-logs${queryString}`);
  }

  async getReports() {
    return this.request<any[]>('/admin/reports');
  }

  async updateReport(id: string, data: any) {
    return this.request<any>(`/admin/reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async moderateUser(userId: string, action: string, reason: string) {
    return this.request<any>(`/admin/users/${userId}/moderate`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  }

  // Room endpoints
  async getRooms() {
    return this.request<Room[]>('/rooms');
  }

  async createRoom(data: { name: string; isPrivate?: boolean; password?: string }) {
    return this.request<Room>('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async joinRoom(roomId: string, password?: string) {
    return this.request<any>(`/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async leaveRoom(roomId: string) {
    return this.request<void>(`/rooms/${roomId}/leave`, {
      method: 'POST',
    });
  }

  async inviteToRoom(roomId: string, userId: string) {
    return this.request<any>(`/rooms/${roomId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }
}

// Create a singleton instance
export const api = new ApiClient();

// React hook for API calls with loading and error states
import { useState, useCallback } from 'react';

export function useApi<T extends (...args: any[]) => Promise<any>>(
  apiMethod: T
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiMethod(...args);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiMethod]);

  return {
    execute,
    loading,
    error,
  };
}