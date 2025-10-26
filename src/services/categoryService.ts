import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// 카테고리 인터페이스
export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  color?: string;
  isActive: boolean;
  displayOrder: number;
  placeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// API 응답 래퍼
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * 모든 활성화된 카테고리 조회
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/api/categories`);
  return response.data.data;
};

/**
 * 장소 개수 포함 카테고리 조회
 */
export const getCategoriesWithCount = async (): Promise<Category[]> => {
  const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/api/categories/with-count`);
  return response.data.data;
};

/**
 * 카테고리 ID로 조회
 */
export const getCategoryById = async (id: number): Promise<Category> => {
  const response = await axios.get<ApiResponse<Category>>(`${API_URL}/api/categories/${id}`);
  return response.data.data;
};

/**
 * 카테고리 생성
 */
export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  const response = await axios.post<ApiResponse<Category>>(`${API_URL}/api/categories`, categoryData);
  return response.data.data;
};

/**
 * 카테고리 수정
 */
export const updateCategory = async (id: number, categoryData: Partial<Category>): Promise<Category> => {
  const response = await axios.put<ApiResponse<Category>>(`${API_URL}/api/categories/${id}`, categoryData);
  return response.data.data;
};

/**
 * 카테고리 삭제
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/api/categories/${id}`);
};

/**
 * 카테고리 활성화/비활성화 토글
 */
export const toggleCategoryStatus = async (id: number): Promise<Category> => {
  const response = await axios.patch<ApiResponse<Category>>(`${API_URL}/api/categories/${id}/toggle-status`);
  return response.data.data;
};

/**
 * 카테고리 검색
 */
export const searchCategories = async (keyword: string): Promise<Category[]> => {
  const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/api/categories/search`, {
    params: { keyword },
  });
  return response.data.data;
};

