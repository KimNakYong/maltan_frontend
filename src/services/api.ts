import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS, TOAST_MESSAGES } from '../utils/constants';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../utils/helpers';
import toast from 'react-hot-toast';

// API 인스턴스 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Access Token 추가
    const accessToken = getLocalStorage<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // 401 Unauthorized - 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getLocalStorage<string>(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh Token으로 Access Token 갱신
        const response = await axios.post(`${API_BASE_URL}/api/user/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 새로운 토큰 저장
        setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료된 경우 로그아웃
        removeLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);
        removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
        removeLocalStorage(STORAGE_KEYS.USER);
        
        toast.error(TOAST_MESSAGES.ERROR.UNAUTHORIZED);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // 403 Forbidden
    if (error.response?.status === 403) {
      toast.error(TOAST_MESSAGES.ERROR.FORBIDDEN);
    }

    // 404 Not Found
    if (error.response?.status === 404) {
      toast.error(TOAST_MESSAGES.ERROR.NOT_FOUND);
    }

    // 500 Server Error
    if (error.response?.status === 500) {
      toast.error(TOAST_MESSAGES.ERROR.SERVER_ERROR);
    }

    // Network Error
    if (!error.response) {
      toast.error(TOAST_MESSAGES.ERROR.NETWORK);
    }

    return Promise.reject(error);
  }
);

export default api;

// API 헬퍼 함수들
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.get<T>(url, config);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.post<T>(url, data, config);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.put<T>(url, data, config);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return api.patch<T>(url, data, config);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => {
    return api.delete<T>(url, config);
  },
};

