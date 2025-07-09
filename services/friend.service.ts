import type { Friend, FriendRequest } from '../types/api';

export interface FriendService {
  getFriends(): Promise<Friend[]>;
  getFriendRequests(): Promise<FriendRequest[]>;
  sendFriendRequest(userId: string): Promise<FriendRequest>;
  acceptFriendRequest(requestId: string): Promise<FriendRequest>;
  rejectFriendRequest(requestId: string): Promise<FriendRequest>;
  removeFriend(friendId: string): Promise<void>;
}

export class FriendServiceImpl implements FriendService {
  constructor(
    private apiBaseUrl: string = typeof window === 'undefined' ? 'http://localhost:8080/v1' : '/v1'
  ) {}

  async getFriends(): Promise<Friend[]> {
    const response = await fetch(`${this.apiBaseUrl}/friends`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friends');
    }

    return await response.json();
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    const response = await fetch(`${this.apiBaseUrl}/friends/requests`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch friend requests');
    }

    return await response.json();
  }

  async sendFriendRequest(userId: string): Promise<FriendRequest> {
    const response = await fetch(`${this.apiBaseUrl}/friends/requests`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to send friend request');
    }

    return await response.json();
  }

  async acceptFriendRequest(requestId: string): Promise<FriendRequest> {
    const response = await fetch(`${this.apiBaseUrl}/friends/requests/${requestId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'accept' }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to accept friend request');
    }

    return await response.json();
  }

  async rejectFriendRequest(requestId: string): Promise<FriendRequest> {
    const response = await fetch(`${this.apiBaseUrl}/friends/requests/${requestId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'reject' }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to reject friend request');
    }

    return await response.json();
  }

  async removeFriend(friendId: string): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/friends/${friendId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to remove friend');
    }
  }
}

export const friendService = new FriendServiceImpl();