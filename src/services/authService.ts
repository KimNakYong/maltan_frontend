import { apiClient } from './api';
import { API_ROUTES, STORAGE_KEYS } from '../utils/constants';
import { setLocalStorage, removeLocalStorage } from '../utils/helpers';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface PreferredRegion {
  city: string;
  cityName: string;
  district: string;
  districtName: string;
  priority: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username?: string; // 선택사항 (없으면 email 사용)
  phone?: string;
  preferredRegions: PreferredRegion[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  phone?: string;
  preferredRegions?: PreferredRegion[];
  profileImage?: string;
  role: 'USER' | 'ADMIN';  // 사용자 권한
  createdAt: string;
  updatedAt: string;
}

// Auth Service
class AuthService {
  /**
   * 로그인
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, data);
    
    // 백엔드 응답 구조: { success: true, message: "...", data: AuthResponse }
    const authData = response.data.data || response.data;
    
    // 토큰 및 사용자 정보 저장
    setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
    setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
    setLocalStorage(STORAGE_KEYS.USER, authData.user);
    
    return authData;
  }

  /**
   * 회원가입
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post(API_ROUTES.AUTH.REGISTER, data);
    
    // 백엔드 응답 구조: { success: true, message: "...", data: AuthResponse }
    const authData = response.data.data || response.data;
    
    // 회원가입 후 자동 로그인 상태로 설정
    setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
    setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
    setLocalStorage(STORAGE_KEYS.USER, authData.user);
    
    return authData;
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // 로컬 스토리지 정리
      removeLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);
      removeLocalStorage(STORAGE_KEYS.REFRESH_TOKEN);
      removeLocalStorage(STORAGE_KEYS.USER);
    }
  }

  /**
   * 현재 사용자 정보 가져오기
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_ROUTES.AUTH.ME);
    
    // 사용자 정보 업데이트
    setLocalStorage(STORAGE_KEYS.USER, response.data);
    
    return response.data;
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ROUTES.AUTH.REFRESH, {
      refreshToken,
    });
    
    // 새로운 토큰 저장
    setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, response.data.accessToken);
    setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    
    return response.data;
  }

  /**
   * 로그인 상태 확인
   */
  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!accessToken;
  }

  /**
   * 저장된 사용자 정보 가져오기
   */
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  }
}

export default new AuthService();

