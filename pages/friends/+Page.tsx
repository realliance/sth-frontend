import React, { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { usePageContext } from 'vike-react/usePageContext';
import { api } from '../../lib/api';
import type { Friend, FriendRequest, User } from '../../types/api';
import { MdAdd, MdPeople, MdInbox } from 'react-icons/md';

const FriendsPage = withFallback(
  () => {
    const pageContext = usePageContext();
    const user = (pageContext as any).user as User | null;
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
    const [showAddModal, setShowAddModal] = useState(false);

    const { data: friendsData } = useSuspenseQuery({
      queryKey: ['friends'],
      queryFn: () => api.getFriends(),
      enabled: !!user,
    });

    const { data: friendRequests } = useSuspenseQuery({
      queryKey: ['friend-requests'],
      queryFn: () => api.getFriendRequests(),
      enabled: !!user,
    });

    if (!user) {
      return (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your friends</h1>
          <a href="/login" className="btn btn-primary">Login</a>
        </div>
      );
    }

    const handleAcceptRequest = async (request: FriendRequest) => {
      try {
        await api.acceptFriendRequest(request.id);
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      } catch (error) {
        console.error('Failed to accept friend request:', error);
        alert('Failed to accept friend request. Please try again.');
      }
    };

    const handleRejectRequest = async (request: FriendRequest) => {
      try {
        await api.rejectFriendRequest(request.id);
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
      } catch (error) {
        console.error('Failed to reject friend request:', error);
        alert('Failed to reject friend request. Please try again.');
      }
    };

    const handleRemoveFriend = async (friend: Friend) => {
      if (!confirm(`Are you sure you want to remove ${friend.username} from your friends?`)) return;

      try {
        await api.removeFriend(friend.id);
        queryClient.invalidateQueries({ queryKey: ['friends'] });
      } catch (error) {
        console.error('Failed to remove friend:', error);
        alert('Failed to remove friend. Please try again.');
      }
    };

    const pendingRequests = friendRequests.filter(r => r.status === 'pending');

    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Friends</h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <MdAdd className="w-5 h-5 mr-2" />
            Add Friend
          </button>
        </div>

        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'friends' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('friends')}
          >
            Friends ({friendsData.length})
          </button>
          <button 
            className={`tab ${activeTab === 'requests' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span className="badge badge-primary badge-sm ml-1">{pendingRequests.length}</span>
            )}
          </button>
        </div>

        {activeTab === 'friends' && (
          <div>
            {friendsData.length === 0 ? (
              <div className="text-center p-8">
                <MdPeople className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
                <h2 className="text-xl font-semibold mb-2">No friends yet</h2>
                <p className="text-base-content/60 mb-4">
                  Add friends to play together and see their activity.
                </p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary"
                >
                  Add Your First Friend
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friendsData.map((friend) => (
                  <FriendCard 
                    key={friend.id} 
                    friend={friend} 
                    onRemove={() => handleRemoveFriend(friend)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            {pendingRequests.length === 0 ? (
              <div className="text-center p-8">
                <MdInbox className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
                <h2 className="text-xl font-semibold mb-2">No pending requests</h2>
                <p className="text-base-content/60">
                  Friend requests will appear here when you receive them.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <FriendRequestCard 
                    key={request.id} 
                    request={request} 
                    onAccept={() => handleAcceptRequest(request)}
                    onReject={() => handleRejectRequest(request)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {showAddModal && (
          <AddFriendModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
            }}
          />
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
        <span>Failed to load friends data. Please try again.</span>
      </div>
      <button onClick={retry} className="btn btn-primary mt-4">
        Retry
      </button>
    </div>
  )
);

export default FriendsPage;

interface FriendCardProps {
  friend: Friend;
  onRemove: () => void;
}

function FriendCard({ friend, onRemove }: FriendCardProps) {
  const getStatusColor = () => {
    switch (friend.status) {
      case 'online': return 'badge-success';
      case 'in_game': return 'badge-warning';
      case 'offline': return 'badge-ghost';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <span className="font-bold">
                {friend.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{friend.username}</h3>
            <div className="flex items-center space-x-2">
              <span className={`badge badge-sm ${getStatusColor()}`}>
                {friend.status}
              </span>
              <span className="text-sm text-base-content/60">
                Rating: {friend.rating}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-primary">Message</button>
          <button className="btn btn-sm btn-ghost">Invite</button>
          <button 
            onClick={onRemove}
            className="btn btn-sm btn-error btn-outline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: () => void;
  onReject: () => void;
}

function FriendRequestCard({ request, onAccept, onReject }: FriendRequestCardProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="font-bold">
                  {request.fromUsername.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{request.fromUsername}</h3>
              <p className="text-sm text-base-content/60">
                Sent {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={onAccept}
              className="btn btn-sm btn-success"
            >
              Accept
            </button>
            <button 
              onClick={onReject}
              className="btn btn-sm btn-error btn-outline"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddFriendModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AddFriendModal({ onClose, onSuccess }: AddFriendModalProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await api.sendFriendRequest(username);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add Friend</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}