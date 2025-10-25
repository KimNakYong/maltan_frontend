import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface Place {
  id: number;
  name: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  description?: string;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export interface RecommendationWithPlaces {
  regionName: string;
  centerLatitude: number;
  centerLongitude: number;
  nearbyPlaces: Place[];
}

// 선호 지역 근처 장소 조회
export const getNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radius: number = 5.0,
  regionName?: string
): Promise<RecommendationWithPlaces> => {
  try {
    const params: any = {
      latitude,
      longitude,
      radius,
    };
    if (regionName) {
      params.regionName = regionName;
    }
    
    const response = await axios.get(`${API_URL}/api/recommendation/places/nearby`, { params });
    return response.data;
  } catch (error) {
    console.error('근처 장소 조회 실패:', error);
    // 에러 시 빈 데이터 반환
    return {
      regionName: regionName || '선호 지역',
      centerLatitude: latitude,
      centerLongitude: longitude,
      nearbyPlaces: [],
    };
  }
};

