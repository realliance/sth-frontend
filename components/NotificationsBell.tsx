import React, { useState } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { withFallback } from 'vike-react-query';
import { api } from '../lib/api';
import type { Notification } from '../types/api';
import { MdNotifications } from 'react-icons/md';

const NotificationsBell = withFallback(
  ({ user }: { user: any }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const queryClient = useQueryClient();

    const { data: notifications } = useSuspenseQuery({
      queryKey: ['notifications'],
      queryFn: () => api.getNotifications(),
      enabled: !!user,
      refetchInterval: 30000, // Poll every 30 seconds
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = async (notificationId: string) => {
      try {
        await api.markNotificationRead(notificationId);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    };

    const markAllAsRead = async () => {
      try {
        await Promise.all(
          notifications
            .filter(n => !n.read)
            .map(n => api.markNotificationRead(n.id))
        );
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    };

    const getNotificationIcon = (type: string) => {
      switch (type) {
        case 'friend_request':
          return '👤';
        case 'game_invite':
          return '🎮';
        case 'achievement':
          return '🏆';
        case 'system':
          return '📢';
        default:
          return '📬';
      }
    };

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        return `${Math.floor(diffInHours / 24)}d ago`;
      }
    };

    if (!user) {
      return null;
    }

    return (
      <div className="relative">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="btn btn-ghost btn-circle btn-sm"
        >
          <MdNotifications className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="badge badge-xs badge-primary absolute -top-1 -right-1">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {showNotifications && (
          <div className="absolute bottom-full right-0 mb-2 w-80 bg-base-200 rounded-lg shadow-lg border border-base-300 z-50">
            <div className="p-4 border-b border-base-300">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="btn btn-xs btn-ghost"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-base-content/60">
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.slice(0, 10).map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-3 hover:bg-base-300 cursor-pointer border-l-4 ${
                        notification.read ? 'border-transparent' : 'border-primary'
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm ${notification.read ? 'text-base-content/70' : 'font-semibold'}`}>
                            {notification.title}
                          </div>
                          <div className="text-xs text-base-content/60 mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-base-content/50 mt-1">
                            {formatTimeAgo(notification.createdAt)}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {notifications.length > 10 && (
              <div className="p-3 border-t border-base-300 text-center">
                <button className="btn btn-xs btn-ghost">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  () => (
    <button className="btn btn-ghost btn-circle btn-sm">
      <MdNotifications className="w-5 h-5" />
    </button>
  ),
  () => (
    <button className="btn btn-ghost btn-circle btn-sm opacity-50">
      <MdNotifications className="w-5 h-5" />
    </button>
  )
);

export default NotificationsBell;