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
