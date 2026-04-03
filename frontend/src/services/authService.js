import api from './api';

const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/users/verify-otp', { email, otp });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  sendOTP: async (email) => {
    const response = await api.post('/users/send-otp', { email });
    return response;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/users/verify-otp', { email, otp });
    return response;
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  googleLogin: async (credential) => {
    const response = await api.post('/users/google-login', { credential });
    if (response.success && response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
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
    const response = await api.get('/users/profile');
    return response;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    if (response.success) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response;
  },
};

export default authService;