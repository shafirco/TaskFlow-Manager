import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        type: 'network'
      });
    }
    
    // Handle API errors
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Task API functions
const taskAPI = {
  // Get all tasks
  getTasks: async () => {
    try {
      const response = await API.get('/tasks');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await API.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId, updateData) => {
    try {
      const response = await API.put(`/tasks/${taskId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId) => {
    try {
      const response = await API.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await API.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default taskAPI;
