import { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) setUser(currentUser);
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      toast.success('Registration successful! Welcome aboard! 🎉');
      return response;
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      toast.success(`Welcome back, ${response.data.user.fullname}! 👋`);
      return response;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.data);
      toast.success('Profile updated successfully! ✅');
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.admin || false,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};