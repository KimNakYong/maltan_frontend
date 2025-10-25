import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// 장소 인터페이스
export interface Place {
  id: number;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  categoryName?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  averageRating?: number;
  reviewCount?: number;
  viewCount?: number;
  isActive: boolean;
  createdBy?: number;
  createdAt: string;
  updatedAt: string;
}

// 장소 목록 응답
export interface PlaceListResponse {
  content: Place[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// API 응답 래퍼
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 모든 장소 조회 (페이징)
 */
export const getAllPlaces = async (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(`${API_URL}/place-service/places`, {
    params: {
      page: params.page || 0,
      size: params.size || 20,
      sortBy: params.sortBy || 'createdAt',
      sortDir: params.sortDir || 'desc',
    },
  });
  return response.data.data;
};

/**
 * 장소 상세 조회
 */
export const getPlaceById = async (id: number): Promise<Place> => {
  const response = await axios.get<ApiResponse<Place>>(`${API_URL}/place-service/places/${id}`);
  return response.data.data;
};

/**
 * 카테고리별 장소 조회
 */
export const getPlacesByCategory = async (
  categoryId: number,
  page: number = 0,
  size: number = 20
): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(
    `${API_URL}/place-service/places/category/${categoryId}`,
    {
      params: { page, size },
    }
  );
  return response.data.data;
};

/**
 * 장소 검색
 */
export const searchPlaces = async (
  keyword: string,
  categoryId?: number,
  page: number = 0,
  size: number = 20
): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(`${API_URL}/place-service/places/search`, {
    params: {
      keyword,
      categoryId,
      page,
      size,
    },
  });
  return response.data.data;
};

/**
 * 주변 장소 검색 (위치 기반)
 */
export const getNearbyPlaces = async (
  latitude: number,
  longitude: number,
  radius: number = 5.0,
  categoryId?: number
): Promise<Place[]> => {
  const response = await axios.get<ApiResponse<Place[]>>(`${API_URL}/place-service/places/nearby`, {
    params: {
      latitude,
      longitude,
      radius,
      categoryId,
    },
  });
  return response.data.data;
};

/**
 * 인기 장소 조회
 */
export const getPopularPlaces = async (page: number = 0, size: number = 20): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(`${API_URL}/place-service/places/popular`, {
    params: { page, size },
  });
  return response.data.data;
};

/**
 * 최신 장소 조회
 */
export const getLatestPlaces = async (page: number = 0, size: number = 20): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(`${API_URL}/place-service/places/latest`, {
    params: { page, size },
  });
  return response.data.data;
};

/**
 * 평점 높은 장소 조회
 */
export const getTopRatedPlaces = async (
  minReviewCount: number = 5,
  page: number = 0,
  size: number = 20
): Promise<PlaceListResponse> => {
  const response = await axios.get<ApiResponse<PlaceListResponse>>(`${API_URL}/place-service/places/top-rated`, {
    params: {
      minReviewCount,
      page,
      size,
    },
  });
  return response.data.data;
};

/**
 * 추천 장소 조회
 */
export const getRecommendedPlaces = async (limit: number = 10): Promise<Place[]> => {
  const response = await axios.get<ApiResponse<Place[]>>(`${API_URL}/place-service/places/recommended`, {
    params: { limit },
  });
  return response.data.data;
};

/**
 * 장소 생성
 */
export const createPlace = async (placeData: Partial<Place>): Promise<Place> => {
  const response = await axios.post<ApiResponse<Place>>(`${API_URL}/place-service/places`, placeData);
  return response.data.data;
};

/**
 * 장소 수정
 */
export const updatePlace = async (id: number, placeData: Partial<Place>): Promise<Place> => {
  const response = await axios.put<ApiResponse<Place>>(`${API_URL}/place-service/places/${id}`, placeData);
  return response.data.data;
};

/**
 * 장소 삭제
 */
export const deletePlace = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/place-service/places/${id}`);
};

