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
  phone?: string;
  phoneNumber?: string;
  username?: string;
  preferredRegions?: PreferredRegion[];
}

// 비밀번호 변경 요청
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 사용자 선호 지역 조회
export const getMyPreferredRegions = async (): Promise<PreferredRegionsResponse> => {
  try {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('로그인이 필요합니다.');
    }
    const user = JSON.parse(userStr);
    const email = user.email;
    
    const response = await axios.get(`${API_URL}/api/user/auth/me/preferred-regions`, {
      params: { email }
    });
    return response.data;
  } catch (error: any) {
    console.error('선호 지역 조회 실패:', error);
    if (error.response?.status === 404) {
      return { preferredRegions: [] };
    }
    throw error;
  }
};

// 사용자 정보 조회
export const getMyInfo = async () => {
  try {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('로그인이 필요합니다.');
    }
    const user = JSON.parse(userStr);
    const email = user.email;
    
    const response = await axios.get(`${API_URL}/api/user/auth/me`, {
      params: { email }
    });
    return response.data.data || response.data; // ApiResponse 구조 처리
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn('User Service: /api/user/me 엔드포인트에서 데이터를 찾을 수 없습니다.');
      // 로컬 스토리지에서 사용자 정보 가져오기
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    throw error;
  }
};

// 프로필 업데이트
export const updateUserProfile = async (data: UpdateProfileRequest) => {
  // 로컬 스토리지에서 사용자 정보 가져오기
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('로그인이 필요합니다.');
  }
  const user = JSON.parse(userStr);
  const email = user.email;
  
  const response = await axios.put(`${API_URL}/api/user/auth/me`, data, {
    params: { email }
  });
  return response.data.data || response.data; // ApiResponse 구조 처리
};

// 비밀번호 변경
export const changeUserPassword = async (data: ChangePasswordRequest) => {
  // 로컬 스토리지에서 사용자 정보 가져오기
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    throw new Error('로그인이 필요합니다.');
  }
  const user = JSON.parse(userStr);
  const email = user.email;
  
  const response = await axios.put(`${API_URL}/api/user/auth/me/password`, data, {
    params: { email }
  });
  return response.data;
};

// 프로필 이미지 업로드
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/api/user/me/profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.imageUrl;
};

// Aliases for backward compatibility
export const getProfile = getMyInfo;
export const updateProfile = updateUserProfile;
export const changePassword = changeUserPassword;

// default export 추가 (userSlice.ts에서 사용)
export default {
  getMyPreferredRegions,
  getMyInfo,
  updateUserProfile,
  changeUserPassword,
  uploadProfileImage,
  getProfile,
  updateProfile,
  changePassword,
};
