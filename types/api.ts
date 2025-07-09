// API response types based on OpenAPI spec

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lobby {
  id: string;
  name: string;
  description: string;
  queueSize: number;
  activeGames: number;
  minRating: number;
  maxRating: number | null;
  preset: LobbyPreset;
}

export interface LobbyPreset {
  id: string;
  name: string;
  settings: Record<string, any>;
}

export interface Bot {
  id: string;
  name: string;
  description: string;
  rating: number;
  status: 'active' | 'inactive' | 'queued';
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Friend {
  id: string;
  username: string;
  rating: number;
  status: 'online' | 'offline' | 'in_game';
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'friend_request' | 'game_invite' | 'system' | 'achievement';
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  players: string[];
  maxPlayers: number;
  status: 'waiting' | 'in_progress' | 'finished';
  isPrivate: boolean;
  createdAt: string;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  averagePosition: number;
  favoriteHand: string;
  totalPoints: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  country: string;
  email?: string | null;
  pronouns?: string | null;
  favorite_tile?: string | null;
}