/**
 * API Service for Backend Communication
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for large datasets
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const apiService = {
  /**
   * Health check
   */
  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  /**
   * Get citation network
   * @param {number} limit - Maximum number of nodes
   * @param {number} minCitations - Minimum citation count
   */
  getCitationNetwork: async (limit = null, minCitations = 0) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      if (minCitations > 0) params.min_citations = minCitations;
      
      const response = await api.get('/api/networks/citation', { params });
      return response.data;
    } catch (error) {
      console.error('API Error (getCitationNetwork):', error);
      if (error.response) {
        // Server responded with error
        throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        // Request made but no response
        throw new Error('Cannot connect to server. Is the backend running?');
      } else {
        // Other errors
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  },

  /**
   * Get collaboration network
   * @param {number} limit - Maximum number of nodes
   * @param {number} minCollaborations - Minimum collaboration count
   */
  getCollaborationNetwork: async (limit = null, minCollaborations = 0) => {
    try {
      const params = {};
      if (limit) params.limit = limit;
      if (minCollaborations > 0) params.min_collaborations = minCollaborations;
      
      const response = await api.get('/api/networks/collaboration', { params });
      return response.data;
    } catch (error) {
      console.error('API Error (getCollaborationNetwork):', error);
      if (error.response) {
        throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Cannot connect to server. Is the backend running?');
      } else {
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  },

  /**
   * Get timeline data
   */
  getTimeline: async () => {
    const response = await api.get('/api/timeline');
    return response.data;
  },

  /**
   * Get overall statistics
   */
  getStats: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  },

  /**
   * Get paper details
   * @param {string} paperId - Paper ID
   */
  getPaperDetails: async (paperId) => {
    const response = await api.get(`/api/paper/${paperId}`);
    return response.data;
  },
};

export default apiService;
