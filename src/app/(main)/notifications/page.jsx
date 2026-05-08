"use client";

import { useNotifications } from "@/hooks/useNotifications";
import Link from "next/link";
import { FiArrowLeft, FiTrash2, FiCheckCircle } from "react-icons/fi";

export default function NotificationsPage() {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
          >
            <FiCheckCircle size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg">
          <div className="text-gray-400 mb-2">No notifications yet</div>
          <p className="text-gray-500 text-sm">When you get notifications, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg transition-all ${
                notification.is_read 
                  ? "bg-gray-900/50" 
                  : "bg-blue-900/20 border-l-4 border-blue-500"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <p className={`${notification.is_read ? "text-gray-400" : "text-white"} mb-1`}>
                    {notification.message}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {new Date(notification.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {!notification.is_read && (
                    <span className="inline-block mt-2 text-xs text-blue-400">Click to mark as read</span>
                  )}
                </div>
                
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  aria-label="Delete notification"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}