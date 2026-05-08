const BASE_URL = 'http://localhost:8000/api/v1';

export const notificationsApi = {
    // Get all notifications
    getAll: async () => {
        const response = await fetch(`${BASE_URL}/notifications`);
        const data = await response.json();
        return { status: 'success', data };
    },

    // Mark a single notification as read
    markAsRead: async (id) => {
        // First get the current notification
        const getResponse = await fetch(`${BASE_URL}/notifications/${id}`);
        const notification = await getResponse.json();
        
        // Update it with is_read = true
        const updateResponse = await fetch(`${BASE_URL}/notifications/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...notification, is_read: true })
        });
        
        const data = await updateResponse.json();
        return { status: 'success', data };
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await fetch(`${BASE_URL}/notifications`);
        const notifications = await response.json();
        
        // Update each notification
        for (const notification of notifications) {
            await fetch(`${BASE_URL}/notifications/${notification.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...notification, is_read: true })
            });
        }
        
        return { status: 'success', message: 'All notifications marked as read' };
    },

    // Delete a notification
    delete: async (id) => {
        await fetch(`${BASE_URL}/notifications/${id}`, {
            method: 'DELETE'
        });
        return { status: 'success', id };
    }
};