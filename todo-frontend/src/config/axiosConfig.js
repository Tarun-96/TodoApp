import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (process.env.REACT_APP_ENABLE_LOGGING === 'true') {
    console.log('API Request:', config);
  }
  return config;
});

export default API;