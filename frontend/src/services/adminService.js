import api from './api';

const adminService = {
    getDashboardStats: async () => {
        return await api.get('/admin/stats');
    },

    // Users
    getAllUsers: async (params = {}) => {
        return await api.get('/admin/users', { params });
    },
    updateUserStatus: async (userId, data) => {
        return await api.put(`/admin/users/${userId}`, data);
    },
    deleteUser: async (userId) => {
        return await api.delete(`/admin/users/${userId}`);
    },

    // Orders
    getAllOrders: async (params = {}) => {
        return await api.get('/admin/orders', { params });
    },
    updateOrderStatus: async (orderId, data) => {
        return await api.patch(`/admin/orders/${orderId}`, data);
    },
    deleteOrder: async (orderId) => {
        return await api.delete(`/admin/orders/${orderId}`);
    },

    // Settings & Logs
    getSettings: async () => {
        return await api.get('/admin/settings');
    },
    updateSettings: async (data) => {
        return await api.put('/admin/settings', data);
    },
    getAdminLogs: async () => {
        return await api.get('/admin/logs');
    }
};

export default adminService;
