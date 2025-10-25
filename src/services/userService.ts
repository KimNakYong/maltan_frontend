import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// 선호 지역 인터페이스
export interface PreferredRegion {
  priority: number;
  city: string;
  cityName: string;
  district: string;
  districtName: string;
}

// 사용자 선호 지역 응답
export interface PreferredRegionsResponse {
  preferredRegions: PreferredRegion[];
}

// 프로필 업데이트 요청
export interface UpdateProfileRequest {
  name?: string;
  phoneNumber?: string;
  preferredRegions?: PreferredRegion[];
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 사용자 선호 지역 조회
export const getMyPreferredRegions = async (): Promise<PreferredRegionsResponse> => {
  const response = await axios.get(`${API_URL}/api/user/me/preferred-regions`);
  return response.data;
};

// 사용자 정보 조회
export const getMyInfo = async () => {
  const response = await axios.get(`${API_URL}/api/user/me`);
  return response.data;
};

// 프로필 업데이트
export const updateUserProfile = async (data: UpdateProfileRequest) => {
  const response = await axios.put(`${API_URL}/api/user/me`, data);
  return response.data;
};

// 비밀번호 변경
export const changeUserPassword = async (data: ChangePasswordRequest) => {
  const response = await axios.put(`${API_URL}/api/user/me/password`, data);
  return response.data;
};

// default export 추가 (userSlice.ts에서 사용)
export default {
  getMyPreferredRegions,
  getMyInfo,
  updateUserProfile,
  changeUserPassword,
};
