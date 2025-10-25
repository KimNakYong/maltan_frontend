import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 사용자 관리 API ===

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  preferredRegions?: any[];
}

export interface UsersResponse {
  users: AdminUser[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

// 사용자 목록 조회
export const getUsers = async (page: number = 0, size: number = 10, search?: string): Promise<UsersResponse> => {
  const params: any = { page, size };
  if (search) {
    params.search = search;
  }
  const response = await api.get('/api/user/admin/users', { params });
  return response.data.data;
};

// 특정 사용자 조회
export const getUser = async (userId: number): Promise<AdminUser> => {
  const response = await api.get(`/api/user/admin/users/${userId}`);
  return response.data.data;
};

// 사용자 역할 변경
export const updateUserRole = async (userId: number, role: 'USER' | 'ADMIN'): Promise<AdminUser> => {
  const response = await api.put(`/api/user/admin/users/${userId}/role`, null, {
    params: { role }
  });
  return response.data.data;
};

// 사용자 활성화/비활성화
export const updateUserStatus = async (userId: number, enabled: boolean): Promise<AdminUser> => {
  const response = await api.put(`/api/user/admin/users/${userId}/status`, null, {
    params: { enabled }
  });
  return response.data.data;
};

// 사용자 삭제
export const deleteUser = async (userId: number): Promise<void> => {
  await api.delete(`/api/user/admin/users/${userId}`);
};

// 사용자 통계 조회
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/api/user/admin/stats');
  return response.data.data;
};

// === 커뮤니티 관리 API ===
// (기존 communityService.ts의 API를 재사용)

export { getPosts, getPost, deletePost as deleteCommunityPost } from './communityService';

