// API configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000'
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
  }
};

const environment = process.env.NODE_ENV || 'development';
const apiConfig = config[environment];

export const API_BASE_URL = apiConfig.API_BASE_URL;

// API endpoints
export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/register`,
  LOGIN: `${API_BASE_URL}/login`,
  LOGOUT: `${API_BASE_URL}/logout`,
  PROFILE: `${API_BASE_URL}/profile`,
  FEEDBACK: `${API_BASE_URL}/feedback`,
  HISTORY: `${API_BASE_URL}/history`,
  PROGRESS: `${API_BASE_URL}/progress`,
  EXPORT_CSV: `${API_BASE_URL}/export/csv`,
};