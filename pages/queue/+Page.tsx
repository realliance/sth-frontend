import React, { useState, useEffect } from 'react';
import { lobbyService } from '../../services/lobby.service';
import type { Lobby } from '../../types/api';
import { MdPeople, MdAccessTime, MdInfo } from 'react-icons/md';

export default function QueuePage() {
  const [currentQueue, setCurrentQueue] = useState<Lobby | null>(null);
  const [queuePosition, setQueuePosition] = useState<number>(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkQueueStatus();
    // Poll queue status every 5 seconds
    const interval = setInterval(checkQueueStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkQueueStatus = async () => {
    try {
      // This would be a new API endpoint to get current queue status
      const response = await fetch('/v1/queue/status', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentQueue(data.lobby);
        setQueuePosition(data.position);
        setEstimatedWaitTime(data.estimatedWaitTime);
      } else if (response.status === 404) {
        // Not in queue
        setCurrentQueue(null);
      }
    } catch (error) {
      console.error('Failed to check queue status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveQueue = async () => {
    if (!currentQueue) return;
    
    try {
      await lobbyService.leaveQueue(currentQueue.id);
      setCurrentQueue(null);
      setQueuePosition(0);
      setEstimatedWaitTime(0);
    } catch (error) {
      console.error('Failed to leave queue:', error);
      alert('Failed to leave queue. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!currentQueue) {
    return (
      <div className="text-center p-8">
        <div className="max-w-md mx-auto">
          <MdPeople className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
          <h1 className="text-2xl font-bold mb-2">Not in Queue</h1>
          <p className="text-base-content/60 mb-4">
            You're not currently in any queue. Go to the lobbies page to join a queue.
          </p>
          <a href="/" className="btn btn-primary">
            Browse Lobbies
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Queue Status</h1>
      
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-primary">
            <MdAccessTime className="w-6 h-6" />
            In Queue for {currentQueue.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title">Position</div>
              <div className="stat-value text-primary">#{queuePosition}</div>
              <div className="stat-desc">in queue</div>
            </div>
            
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title">Players Needed</div>
              <div className="stat-value text-secondary">{4 - (currentQueue.queueSize % 4)}</div>
              <div className="stat-desc">to start game</div>
            </div>
            
            <div className="stat bg-base-100 rounded-lg">
              <div className="stat-title">Est. Wait Time</div>
              <div className="stat-value text-accent">{Math.ceil(estimatedWaitTime / 60)}min</div>
              <div className="stat-desc">estimated</div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Queue Progress</span>
              <span className="text-sm">{currentQueue.queueSize}/4 players</span>
            </div>
            <progress 
              className="progress progress-primary w-full" 
              value={currentQueue.queueSize % 4} 
              max="4"
            ></progress>
          </div>
          
          <div className="mt-6 p-4 bg-info/10 rounded-lg">
            <div className="flex items-start space-x-3">
              <MdInfo className="w-5 h-5 text-info mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-info">Stay Ready!</h4>
                <p className="text-sm text-base-content/70">
                  Keep this tab active. You'll be automatically matched when enough players join.
                  The game will start soon!
                </p>
              </div>
            </div>
          </div>
          
          <div className="card-actions justify-end mt-6">
            <button onClick={leaveQueue} className="btn btn-error btn-outline">
              Leave Queue
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title text-lg">Lobby Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{currentQueue.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Description:</span>
                <span className="font-medium">{currentQueue.description}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating Range:</span>
                <span className="font-medium">
                  {currentQueue.minRating} - {currentQueue.maxRating || '∞'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Games:</span>
                <span className="font-medium">{currentQueue.activeGames}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}