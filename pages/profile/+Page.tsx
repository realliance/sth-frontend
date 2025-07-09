import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { usePageContext } from 'vike-react/usePageContext';
import { api } from '../../lib/api';
import type { User } from '../../types/api';

const ProfilePage = withFallback(
  () => {
    const pageContext = usePageContext();
    const user = (pageContext as any).user as User | null;

    const { data: stats } = useSuspenseQuery({
      queryKey: ['user-stats'],
      queryFn: () => api.getUserStats(),
      enabled: !!user,
    });

    if (!user) {
      return (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <a href="/login" className="btn btn-primary">Login</a>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <div className="avatar mb-4">
                  <div className="w-24 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <h2 className="card-title justify-center text-xl">{user.username}</h2>
                <p className="text-base-content/60">{user.email}</p>
                
                <div className="divider"></div>
                
                <div className="space-y-2">
                  <div className="stat">
                    <div className="stat-title">Current Rating</div>
                    <div className="stat-value text-primary">{user.rating}</div>
                  </div>
                  
                  <div className="badge badge-outline">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
                
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-primary btn-sm">Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Game Statistics</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Games Played</div>
                    <div className="stat-value text-primary">{stats.gamesPlayed}</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Games Won</div>
                    <div className="stat-value text-success">{stats.gamesWon}</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Win Rate</div>
                    <div className="stat-value text-accent">{(stats.winRate * 100).toFixed(1)}%</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Avg Position</div>
                    <div className="stat-value text-secondary">{stats.averagePosition.toFixed(1)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Total Points</div>
                    <div className="stat-value text-info">{stats.totalPoints.toLocaleString()}</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg">
                    <div className="stat-title">Favorite Hand</div>
                    <div className="stat-value text-lg text-warning">{stats.favoriteHand}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Achievements */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Recent Achievements</h3>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center space-x-3 p-3 bg-base-100 rounded-lg">
                    <div className="badge badge-success">🏆</div>
                    <div className="flex-1">
                      <div className="font-semibold">First Victory</div>
                      <div className="text-sm text-base-content/60">Won your first game</div>
                    </div>
                    <div className="text-sm text-base-content/60">2 days ago</div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-base-100 rounded-lg">
                    <div className="badge badge-primary">🎯</div>
                    <div className="flex-1">
                      <div className="font-semibold">Mahjong Master</div>
                      <div className="text-sm text-base-content/60">Called Riichi 10 times</div>
                    </div>
                    <div className="text-sm text-base-content/60">1 week ago</div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-base-100 rounded-lg">
                    <div className="badge badge-info">⭐</div>
                    <div className="flex-1">
                      <div className="font-semibold">Rising Star</div>
                      <div className="text-sm text-base-content/60">Reached 1500 rating</div>
                    </div>
                    <div className="text-sm text-base-content/60">2 weeks ago</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Account Settings */}
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Account Settings</h3>
                
                <div className="space-y-4 mt-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Email notifications</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Game sound effects</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Friend requests</span>
                      <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                    </label>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="flex space-x-2">
                    <button className="btn btn-primary btn-sm">Save Changes</button>
                    <button className="btn btn-error btn-outline btn-sm">Delete Account</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <span>Failed to load profile data. Please try again.</span>
      </div>
      <button onClick={retry} className="btn btn-primary mt-4">
        Retry
      </button>
    </div>
  )
);

export default ProfilePage;