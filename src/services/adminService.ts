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

// 커뮤니티 게시글 삭제
export const deleteCommunityPost = async (postId: number): Promise<void> => {
  // 관리자는 userId 없이 삭제 가능하도록 임시 처리
  // TODO: 백엔드에서 관리자 권한 체크 후 userId 없이도 삭제 가능하도록 수정 필요
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.id || 1; // 임시: 관리자 ID
  
  await api.delete(`/api/community/posts/${postId}?userId=${userId}`);
};

// 사용자 통계 조회
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/api/user/admin/stats');
  return response.data.data;
};

// 대시보드 통계 조회
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  adminUsers: number;
  inactiveUsers: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const userStatsResponse = await api.get('/api/user/admin/stats');
    const userStats = userStatsResponse.data.data || userStatsResponse.data;
    
    // 커뮤니티 게시글 수 조회
    const postsResponse = await api.get('/api/community/posts?page=0&size=1');
    const totalPosts = postsResponse.data.totalElements || 0;
    
    return {
      totalUsers: userStats.totalUsers || 0,
      activeUsers: userStats.activeUsers || 0,
      totalPosts: totalPosts,
      adminUsers: userStats.adminUsers || 0,
      inactiveUsers: userStats.inactiveUsers || 0,
    };
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error);
    // 에러 시 기본값 반환
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalPosts: 0,
      adminUsers: 0,
      inactiveUsers: 0,
    };
  }
};

// === 커뮤니티 관리 API ===
// (기존 communityService.ts의 API를 재사용)

export { getPosts, getPost } from './communityService';

