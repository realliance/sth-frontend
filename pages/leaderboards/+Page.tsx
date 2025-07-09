import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { api } from '../../lib/api';
import type { LeaderboardEntry } from '../../services/stats.service';
import { MdPerson, MdComputer, MdBarChart } from 'react-icons/md';

const LeaderboardsPage = withFallback(
  () => {
    const [activeTab, setActiveTab] = useState<'players' | 'bots'>('players');

    const { data: playerLeaderboard } = useSuspenseQuery({
      queryKey: ['leaderboard', 'players'],
      queryFn: () => api.getLeaderboards('player'),
    });

    const { data: botLeaderboard } = useSuspenseQuery({
      queryKey: ['leaderboard', 'bots'],
      queryFn: () => api.getLeaderboards('bot'),
    });

    const currentLeaderboard = activeTab === 'players' ? playerLeaderboard : botLeaderboard;

    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Leaderboards</h1>
        
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'players' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            <MdPerson className="w-5 h-5 mr-2" />
            Players ({playerLeaderboard.length})
          </button>
          <button 
            className={`tab ${activeTab === 'bots' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('bots')}
          >
            <MdComputer className="w-5 h-5 mr-2" />
            Bots ({botLeaderboard.length})
          </button>
        </div>

        {currentLeaderboard.length === 0 ? (
          <div className="text-center p-8">
            <MdBarChart className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
            <h2 className="text-xl font-semibold mb-2">No {activeTab} ranked yet</h2>
            <p className="text-base-content/60">
              {activeTab === 'players' 
                ? 'Play games to appear on the leaderboard.' 
                : 'Create and train bots to compete on the leaderboard.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 Podium */}
            {currentLeaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {currentLeaderboard.slice(0, 3).map((entry, index) => (
                  <PodiumCard 
                    key={entry.id} 
                    entry={entry} 
                    position={index + 1} 
                    type={activeTab}
                  />
                ))}
              </div>
            )}

            {/* Full Leaderboard Table */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  {activeTab === 'players' ? 'All Players' : 'All Bots'}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Rating</th>
                        <th>Games</th>
                        <th>Win Rate</th>
                        <th>Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLeaderboard.map((entry, index) => (
                        <LeaderboardRow 
                          key={entry.id} 
                          entry={entry} 
                          rank={index + 1}
                          type={activeTab}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  () => (
    <div className="flex justify-center p-8">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ),
  ({ retry }) => (
    <div className="text-center p-8">
      <div className="alert alert-error">
        <span>Failed to load leaderboards. Please try again.</span>
      </div>
      <button onClick={retry} className="btn btn-primary mt-4">
        Retry
      </button>
    </div>
  )
);

export default LeaderboardsPage;

interface PodiumCardProps {
  entry: LeaderboardEntry;
  position: number;
  type: 'players' | 'bots';
}

function PodiumCard({ entry, position, type }: PodiumCardProps) {
  const getPositionColor = () => {
    switch (position) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900';
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800';
      case 3: return 'bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100';
      default: return 'bg-base-300';
    }
  };

  const getPositionIcon = () => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className={`card ${getPositionColor()} shadow-xl ${position === 1 ? 'scale-105' : ''}`}>
      <div className="card-body text-center">
        <div className="text-3xl mb-2">{getPositionIcon()}</div>
        <h3 className="card-title justify-center text-lg">{entry.username}</h3>
        <div className="space-y-1">
          <div className="stat-value text-2xl">{entry.rating}</div>
          <div className="text-sm opacity-75">{entry.gamesPlayed} games</div>
          <div className="text-sm opacity-75">{(entry.winRate * 100).toFixed(1)}% wins</div>
        </div>
      </div>
    </div>
  );
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  type: 'players' | 'bots';
}

function LeaderboardRow({ entry, rank, type }: LeaderboardRowProps) {
  const getRankBadge = () => {
    if (rank <= 3) {
      return <span className="badge badge-warning">#{rank}</span>;
    } else if (rank <= 10) {
      return <span className="badge badge-info">#{rank}</span>;
    } else {
      return <span className="badge badge-ghost">#{rank}</span>;
    }
  };

  const getTrendIcon = () => {
    // Simulate trend data - in real app this would come from the API
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    if (trend === 'up') {
      return <span className="text-success">↗️ +{Math.floor(Math.random() * 50)}</span>;
    } else {
      return <span className="text-error">↘️ -{Math.floor(Math.random() * 30)}</span>;
    }
  };

  return (
    <tr className={rank <= 3 ? 'bg-base-300' : ''}>
      <td>
        <div className="flex items-center space-x-2">
          {getRankBadge()}
        </div>
      </td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="text-xs font-bold">
                {entry.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <div className="font-bold">{entry.username}</div>
            {type === 'bots' && (
              <div className="text-sm opacity-50">AI Bot</div>
            )}
          </div>
        </div>
      </td>
      <td>
        <span className="badge badge-primary badge-lg">{entry.rating}</span>
      </td>
      <td>{entry.gamesPlayed}</td>
      <td>
        <div className="flex items-center space-x-2">
          <span>{(entry.winRate * 100).toFixed(1)}%</span>
          <progress 
            className="progress progress-success w-16" 
            value={entry.winRate * 100} 
            max="100"
          ></progress>
        </div>
      </td>
      <td>
        <div className="text-sm">
          {getTrendIcon()}
        </div>
      </td>
    </tr>
  );
}