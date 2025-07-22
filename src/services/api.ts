import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import config from '../utils/config';

// Optionally, import AsyncStorage if you want to attach tokens from storage
// import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = config.baseUrl;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching tokens
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Example: Attach token from AsyncStorage
    // const token = await AsyncStorage.getItem('accessToken');
    // if (token) {
    //   config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Example: Handle 401 and refresh token logic here
    // if (error.response?.status === 401) {
    //   // Attempt token refresh logic
    // }
    // Retry logic for network errors
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (!config._retry && (!error.response || error.code === 'ECONNABORTED')) {
      config._retry = true;
      // Optionally, add exponential backoff or limit retries
      return api(config);
    }
    // Centralized error handling
    return Promise.reject(error);
  }
);

export default api; 