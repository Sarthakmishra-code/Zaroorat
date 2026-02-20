import api from './api';

const vehicleService = {
  // Bikes
  getBikes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/bikes?${queryString}`);
  },

  getBikeById: async (id) => {
    return await api.get(`/bikes/${id}`);
  },

  // Cars
  getCars: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/cars?${queryString}`);
  },

  getCarById: async (id) => {
    return await api.get(`/cars/${id}`);
  },

  // Hostels
  getHostels: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/hostels?${queryString}`);
  },

  getHostelById: async (id) => {
    return await api.get(`/hostels/${id}`);
  },

  // Admin only
  createBike: async (formData) => {
    return await api.post('/bikes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createCar: async (formData) => {
    return await api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createHostel: async (formData) => {
    return await api.post('/hostels', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default vehicleService;
