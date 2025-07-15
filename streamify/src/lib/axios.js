import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true // ✅ Add this
});

export const BACKEND_URL = "http://localhost:3000/api";
