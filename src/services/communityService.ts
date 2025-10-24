import axios from 'axios';

// API Base URL?� �?문자??(?��? 경로 ?�용 - Nginx ?�록??
const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// 게시글 ?�터?�이??
export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  regionSi: string;
  regionGu?: string;
  regionDong?: string;
  isRecruitment: boolean;
  recruitmentMax?: number;
  recruitmentCurrent?: number;
  recruitmentDeadline?: string;
  eventDate?: string;
  eventLocation?: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  isDeleted: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  images?: PostImage[];
}

export interface PostImage {
  id: number;
  postId: number;
  imageUrl: string;
  imageOrder: number;
  createdAt: string;
}

// ?��? ?�터?�이??
export interface Comment {
  id: number;
  postId: number;
  userId: number;
  parentCommentId?: number;
  content: string;
  likeCount: number;
  dislikeCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

// 게시글 목록 ?�청 ?�라미터
export interface PostListParams {
  category?: string;
  regionSi?: string;
  regionGu?: string;
  regionDong?: string;
  isRecruitment?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

// 게시글 목록 ?�답
export interface PostListResponse {
  content: Post[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 게시글 ?�성 ?�청
export interface CreatePostRequest {
  title: string;
  content: string;
  category: string;
  regionSi: string;
  regionGu?: string;
  regionDong?: string;
  isRecruitment: boolean;
  recruitmentMax?: number;
  recruitmentDeadline?: string;
  eventDate?: string;
  eventLocation?: string;
  imageUrls?: string[];
}

// ?��? ?�성 ?�청
export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

// ?�표 ?�청
export interface VoteRequest {
  voteType: 'LIKE' | 'DISLIKE';
}

// Axios ?�터?�터 ?�정
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ?�청 ?�터?�터: ?�큰 추�?
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 게시글 API ===

// 게시글 목록 조회
export const getPosts = async (params: PostListParams = {}): Promise<PostListResponse> => {
  const response = await api.get('/api/community/posts', { params });
  return response.data;
};

// 게시글 ?�세 조회
export const getPost = async (postId: number): Promise<Post> => {
  const response = await api.get(`/api/community/posts/${postId}`);
  return response.data;
};

// 게시글 ?�성
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await api.post('/api/community/posts', data);
  return response.data;
};

// 게시글 ?�정
export const updatePost = async (postId: number, data: Partial<CreatePostRequest>): Promise<Post> => {
  const response = await api.put(`/api/community/posts/${postId}`, data);
  return response.data;
};

// 게시글 ??��
export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/api/community/posts/${postId}`);
};

// === ?��? API ===

// ?��? 목록 조회
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get(`/api/community/posts/${postId}/comments`);
  return response.data;
};

// ?��? ?�성
export const createComment = async (postId: number, data: CreateCommentRequest): Promise<Comment> => {
  const response = await api.post(`/api/community/posts/${postId}/comments`, data);
  return response.data;
};

// ?��? ?�정
export const updateComment = async (commentId: number, content: string): Promise<Comment> => {
  const response = await api.put(`/api/community/comments/${commentId}`, { content });
  return response.data;
};

// ?��? ??��
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/api/community/comments/${commentId}`);
};

// === 추천/비추�?API ===

// 게시글 추천/비추�?
export const votePost = async (postId: number, voteType: 'LIKE' | 'DISLIKE'): Promise<void> => {
  await api.post(`/api/community/posts/${postId}/vote`, { voteType });
};

// 게시글 추천/비추�?취소
export const unvotePost = async (postId: number): Promise<void> => {
  await api.delete(`/api/community/posts/${postId}/vote`);
};

// ?��? 추천/비추�?
export const voteComment = async (commentId: number, voteType: 'LIKE' | 'DISLIKE'): Promise<void> => {
  await api.post(`/api/community/comments/${commentId}/vote`, { voteType });
};

// ?��? 추천/비추�?취소
export const unvoteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/api/community/comments/${commentId}/vote`);
};

// === 모집 참여 API ===

// 모집 참여/취소 (?��?)
export const toggleParticipation = async (postId: number): Promise<{ participated: boolean; currentCount: number }> => {
  const response = await api.post(`/api/community/posts/${postId}/participate`);
  return response.data;
};

// 참여??목록 조회
export const getParticipants = async (postId: number): Promise<any[]> => {
  const response = await api.get(`/api/community/posts/${postId}/participants`);
  return response.data;
};

export default api;

