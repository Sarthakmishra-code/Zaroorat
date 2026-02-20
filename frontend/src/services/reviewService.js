import api from './api';

const reviewService = {
  createReview: async (reviewData) => {
    return await api.post('/comments', reviewData);
  },

  getReviewsByService: async (serviceId) => {
    return await api.get(`/comments/service/${serviceId}`);
  },

  getMyReviews: async () => {
    return await api.get('/comments/my-reviews');
  },

  updateReview: async (id, reviewData) => {
    return await api.put(`/comments/${id}`, reviewData);
  },

  deleteReview: async (id) => {
    return await api.delete(`/comments/${id}`);
  },
};

export default reviewService;