// src/utils/auth.js
import axios from 'axios';

// Store JWT token
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get JWT token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token (on logout)
export const clearToken = () => {
  localStorage.removeItem('token');
};

// Get decoded user data from token
export const parseToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (err) {
    console.error('Invalid token');
    return null;
  }
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!getToken();
};

// Axios instance with auth header
export const axiosWithAuth = () => {
  const token = getToken();

  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};
