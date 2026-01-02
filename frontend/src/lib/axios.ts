import axios from 'axios';
import type { AxiosInstance } from 'axios';

declare global {
  interface Window {
    RUNTIME_CONFIG?: {
      VITE_SPACE_BASE_URL?: string;
      VITE_ENVIRONMENT?: string;
      VITE_SPACE_ADMIN_API_KEY?: string;
    };
  }
}

const baseURL = 
  window.RUNTIME_CONFIG?.VITE_SPACE_BASE_URL || 
  import.meta.env.VITE_SPACE_BASE_URL ||        
  'http://localhost:3000/api/v1';               

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;