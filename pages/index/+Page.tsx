import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { usePageContext } from 'vike-react/usePageContext';
import { api } from '../../lib/api';
import type { Lobby, User } from '../../types/api';
import { Link } from '../../components/Link';
import { MdLock } from 'react-icons/md';

const LobbiesPage = withFallback(
  () => {
    const pageContext = usePageContext();
    const user = (pageContext as any).user as User | null;

    // Show login screen if user is not authenticated
    if (!user) {
      return (
        <div className="text-center p-12">
          <div className="max-w-md mx-auto">
            <MdLock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Login to Play</h2>
            <p className="text-base-content/60 mb-6">
              Sign in to your account to view available lobbies and join games.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn btn-primary btn-lg">
                Login Now
              </Link>
              <Link href="/register" className="btn btn-outline btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const { data: lobbies } = useSuspenseQuery({
      queryKey: ['lobbies'],
      queryFn: async () => {
        try {
          return await api.getAllLobbies();
        } catch (error) {
          // Handle authentication errors - check for both ApiError status and error messages
          if ((error as any)?.status === 401 || 
              (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized')))) {
            // Redirect to login to refresh auth state
            window.location.href = '/login';
            return [];
          }
          throw error;
        }
      },
    });

    const handleJoinQueue = async (lobby: Lobby) => {
      try {
        await api.joinQueue(lobby.id);
        // Redirect to queue page on success
        window.location.href = '/queue';
      } catch (error) {
        console.error('Failed to join queue:', error);
        alert('Failed to join queue. Please make sure you are logged in.');
      }
    };


    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Available Lobbies</h1>
        
        {lobbies.length === 0 ? (
          <div className="text-center p-8">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-xl font-semibold mb-2">No Lobbies Found</h2>
              <p className="text-base-content/60 mb-4">
                There are no active lobbies at the moment. Check back later or create your own game room!
              </p>
              <Link href="/queue" className="btn btn-outline">
                Check Queue Status
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lobbies.map((lobby) => (
              <LobbyCard 
                key={lobby.id} 
                lobby={lobby} 
                onJoinQueue={() => handleJoinQueue(lobby)} 
              />
            ))}
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
  ({ retry, error }) => {
    // Check if this is an authentication error
    const isAuthError = (error as any)?.status === 401 || 
                       (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized')));

    if (isAuthError) {
      return (
        <div className="text-center p-12">
          <div className="max-w-md mx-auto">
            <MdLock className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
            <p className="text-base-content/60 mb-6">
              Your session has expired. Please log in again to view lobbies.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn btn-primary btn-lg">
                Login Again
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-8">
        <div className="alert alert-error">
          <span>Failed to load lobbies. Please try again.</span>
        </div>
        <button onClick={retry} className="btn btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }
);

export default LobbiesPage;

interface LobbyCardProps {
  lobby: Lobby;
  onJoinQueue: () => void;
}

function LobbyCard({ lobby, onJoinQueue }: LobbyCardProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{lobby.name}</h2>
        <p className="text-sm text-base-content/60">{lobby.description}</p>
        
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <span className="text-sm">Players in queue:</span>
            <span className="badge badge-primary">{lobby.queueSize}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Games active:</span>
            <span className="badge badge-secondary">{lobby.activeGames}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Rating range:</span>
            <span className="text-sm font-medium">
              {lobby.minRating} - {lobby.maxRating || '∞'}
            </span>
          </div>
        </div>
        
        <div className="card-actions justify-end mt-4">
          <button 
            onClick={onJoinQueue}
            className="btn btn-primary"
          >
            Join Queue
          </button>
        </div>
      </div>
    </div>
  );
}