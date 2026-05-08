import { useState, useEffect, useCallback } from "react";
import { notificationsApi } from "@/lib/notifications";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

// fetch notification from API
const fetchNotifications = useCallback(async () => {
    try{
        setLoading(true);
        const response = await notificationsApi.getAll();

        // handle different response shapes
        const data = response.data || response;
        setNotifications(data);
        setError(null);
    } catch (err){
        console.error('Error fetching notifications', err)
        setError(err.message);
    } finally{
        setLoading(false);
    }
}, []);

// Mark a single notification as read
const markAsRead = async (id) => {
    try{
        await notificationsApi.markAsRead(id);
        
        // Refresh the list after marking as read
        await fetchNotifications()

    } catch (err){
        console.error('Error marking notification as read', err)
    }

};

const markAllAsRead = async () =>{
    try{
        await notificationsApi.markAllAsRead();
        await fetchNotifications();
    }
    catch (err){
        console.error('Error marking all notifications as read', err)
    }
};

const deleteNotification = async (id) => {
    try{
        await notificationsApi.delete(id);
        await fetchNotifications();
    }
    catch(err){
        console.error('Error deleting the notification', err)
    }
};

// Load notification when components mount
useEffect(()=>{
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);

    // CLeanup interval on component unmount
    return () => clearInterval(interval);

}, [fetchNotifications]);

// Calculate unread count
const unreadCount = notifications.filter(n => !n.is_read).length;

// Get last 5 notifications for dropdown
const recentNotifications = notifications.slice(0, 5);

return{
    notifications,
    recentNotifications,
    unreadCount,
    loading,
    error,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
};
};