import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },
};

export default authService;