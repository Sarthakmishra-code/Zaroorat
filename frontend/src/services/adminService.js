import api from './api';

const adminService = {
    getDashboardStats: async () => {
        return await api.get('/admin/dashboard');
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
        return await api.put(`/admin/orders/${orderId}`, data);
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
