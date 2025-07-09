import React, { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { usePageContext } from 'vike-react/usePageContext';
import { api } from '../../lib/api';
import type { Bot, User } from '../../types/api';
import { MdAdd, MdComputer } from 'react-icons/md';

const BotsPage = withFallback(
  () => {
    const pageContext = usePageContext();
    const user = (pageContext as any).user as User | null;
    const queryClient = useQueryClient();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { data: bots } = useSuspenseQuery({
      queryKey: ['bots'],
      queryFn: () => api.getBots(),
      enabled: !!user,
    });

    if (!user) {
      return (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Please log in to manage your bots</h1>
          <a href="/login" className="btn btn-primary">Login</a>
        </div>
      );
    }

    const deleteBot = async (botId: string) => {
      if (!confirm('Are you sure you want to delete this bot?')) return;

      try {
        await api.deleteBot(botId);
        queryClient.invalidateQueries({ queryKey: ['bots'] });
      } catch (error) {
        console.error('Failed to delete bot:', error);
        alert('Failed to delete bot. Please try again.');
      }
    };

    const toggleBotStatus = async (bot: Bot) => {
      const newStatus = bot.status === 'active' ? 'inactive' : 'active';
      
      try {
        await api.updateBot(bot.id, { status: newStatus });
        queryClient.invalidateQueries({ queryKey: ['bots'] });
      } catch (error) {
        console.error('Failed to update bot status:', error);
        alert('Failed to update bot status. Please try again.');
      }
    };

    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Bots</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <MdAdd className="w-5 h-5 mr-2" />
            Create Bot
          </button>
        </div>

        {bots.length === 0 ? (
          <div className="text-center p-8">
            <MdComputer className="w-16 h-16 mx-auto mb-4 text-base-content/40" />
            <h2 className="text-xl font-semibold mb-2">No bots yet</h2>
            <p className="text-base-content/60 mb-4">
              Create your first AI bot to automatically join games and improve your ranking.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Create Your First Bot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <BotCard 
                key={bot.id} 
                bot={bot} 
                onDelete={() => deleteBot(bot.id)}
                onToggleStatus={() => toggleBotStatus(bot)}
              />
            ))}
          </div>
        )}

        {showCreateModal && (
          <CreateBotModal 
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['bots'] });
              setShowCreateModal(false);
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
        <span>Failed to load bots. Please try again.</span>
      </div>
      <button onClick={retry} className="btn btn-primary mt-4">
        Retry
      </button>
    </div>
  )
);

export default BotsPage;

interface BotCardProps {
  bot: Bot;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function BotCard({ bot, onDelete, onToggleStatus }: BotCardProps) {
  const getStatusColor = () => {
    switch (bot.status) {
      case 'active': return 'badge-success';
      case 'queued': return 'badge-warning';
      case 'inactive': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title">{bot.name}</h2>
          <span className={`badge ${getStatusColor()}`}>
            {bot.status}
          </span>
        </div>
        
        <p className="text-sm text-base-content/60 mb-4">{bot.description}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Rating:</span>
            <span className="font-semibold">{bot.rating}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Created:</span>
            <span className="text-sm">{new Date(bot.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="card-actions justify-between mt-4">
          <div className="flex space-x-1">
            <button 
              onClick={onToggleStatus}
              className={`btn btn-sm ${bot.status === 'active' ? 'btn-warning' : 'btn-success'}`}
            >
              {bot.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button className="btn btn-sm btn-ghost">Edit</button>
          </div>
          <button 
            onClick={onDelete}
            className="btn btn-sm btn-error btn-outline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface CreateBotModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateBotModal({ onClose, onSuccess }: CreateBotModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.createBot(formData);
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create bot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create New Bot</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="form-control">
            <label className="label">
              <span className="label-text">Bot Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter bot name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full"
              placeholder="Describe your bot's playing style (optional)"
              rows={3}
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
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Creating...' : 'Create Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}