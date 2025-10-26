import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// 리뷰 인터페이스
export interface Review {
  id: number;
  rating: number;
  content?: string;
  userId: number;
  userName?: string;
  placeId: number;
  isActive: boolean;
  likeCount: number;
  photos?: ReviewPhoto[];
  createdAt: string;
  updatedAt?: string;
}

// 리뷰 사진 인터페이스
export interface ReviewPhoto {
  id: number;
  originalName?: string;
  storedName?: string;
  filePath: string;
  fileUrl?: string;
  fileSize?: number;
  contentType?: string;
  reviewId?: number;
  createdAt?: string;
}

// 리뷰 생성 요청
export interface CreateReviewRequest {
  rating: number;
  content?: string;
  userId: number;
  userName?: string;
  placeId: number;
}

// API 응답 래퍼
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 리뷰 페이지 응답
export interface ReviewPageResponse {
  content: Review[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 장소별 리뷰 목록 조회
 */
export const getReviewsByPlace = async (
  placeId: number,
  page: number = 0,
  size: number = 10
): Promise<ReviewPageResponse> => {
  const response = await axios.get<ApiResponse<ReviewPageResponse>>(
    `${API_URL}/api/reviews/place/${placeId}`,
    { params: { page, size } }
  );
  return response.data.data;
};

/**
 * 리뷰 생성
 */
export const createReview = async (request: CreateReviewRequest): Promise<Review> => {
  const response = await axios.post<ApiResponse<Review>>(`${API_URL}/api/reviews`, request);
  return response.data.data;
};

/**
 * 리뷰 수정
 */
export const updateReview = async (id: number, request: Partial<CreateReviewRequest>): Promise<Review> => {
  const response = await axios.put<ApiResponse<Review>>(`${API_URL}/api/reviews/${id}`, request);
  return response.data.data;
};

/**
 * 리뷰 삭제
 */
export const deleteReview = async (id: number, userId: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/reviews/${id}`, { params: { userId } });
};

/**
 * 사용자가 특정 장소에 리뷰를 작성했는지 확인
 */
export const hasUserReviewedPlace = async (placeId: number, userId: number): Promise<boolean> => {
  const response = await axios.get<ApiResponse<boolean>>(
    `${API_URL}/api/reviews/place/${placeId}/user/${userId}/exists`
  );
  return response.data.data;
};

/**
 * 사용자의 특정 장소 리뷰 조회
 */
export const getUserReviewForPlace = async (placeId: number, userId: number): Promise<Review | null> => {
  try {
    const response = await axios.get<ApiResponse<Review>>(
      `${API_URL}/api/reviews/place/${placeId}/user/${userId}`
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

/**
 * 리뷰 좋아요
 */
export const likeReview = async (id: number): Promise<Review> => {
  const response = await axios.post<ApiResponse<Review>>(`${API_URL}/api/reviews/${id}/like`);
  return response.data.data;
};

/**
 * 리뷰 좋아요 취소
 */
export const unlikeReview = async (id: number): Promise<Review> => {
  const response = await axios.delete<ApiResponse<Review>>(`${API_URL}/api/reviews/${id}/like`);
  return response.data.data;
};

/**
 * 장소별 평균 평점 조회
 */
export const getAverageRatingByPlace = async (placeId: number): Promise<number> => {
  const response = await axios.get<ApiResponse<number>>(
    `${API_URL}/api/reviews/place/${placeId}/average-rating`
  );
  return response.data.data;
};

/**
 * 장소별 리뷰 개수 조회
 */
export const getReviewCountByPlace = async (placeId: number): Promise<number> => {
  const response = await axios.get<ApiResponse<number>>(
    `${API_URL}/api/reviews/place/${placeId}/count`
  );
  return response.data.data;
};

