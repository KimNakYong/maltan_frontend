import { apiClient } from './api';
import { API_ROUTES } from '../utils/constants';
import { User } from './authService';

// Types
export interface UpdateProfileRequest {
  username?: string;
  address?: string;
  phone?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User Service
class UserService {
  /**
   * 프로필 조회
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ROUTES.USER.PROFILE);
    return response.data;
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>(API_ROUTES.USER.UPDATE_PROFILE, data);
    return response.data;
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await apiClient.post(API_ROUTES.USER.CHANGE_PASSWORD, data);
  }

  /**
   * 회원 탈퇴
   */
  async deleteAccount(): Promise<void> {
    await apiClient.delete(API_ROUTES.USER.DELETE_ACCOUNT);
  }

  /**
   * 프로필 이미지 업로드
   */
  async uploadProfileImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ url: string }>(
      '/api/user/profile/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.url;
  }
}

export default new UserService();

