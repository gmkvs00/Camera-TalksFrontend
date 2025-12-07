import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
  console.log("url",process.env.VITE_API_BASE_URL);
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
