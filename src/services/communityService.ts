import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// 게시글 인터페이스
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

// 댓글 인터페이스
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

// 게시글 목록 요청 파라미터
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

// 게시글 목록 응답
export interface PostListResponse {
  content: Post[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// 게시글 작성 요청
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

// 댓글 작성 요청
export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

// 투표 요청
export interface VoteRequest {
  voteType: 'LIKE' | 'DISLIKE';
}

// Axios 인터셉터 설정
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 추가
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
  const response = await api.get('/community/posts', { params });
  return response.data;
};

// 게시글 상세 조회
export const getPost = async (postId: number): Promise<Post> => {
  const response = await api.get(`/community/posts/${postId}`);
  return response.data;
};

// 게시글 작성
export const createPost = async (data: CreatePostRequest): Promise<Post> => {
  const response = await api.post('/community/posts', data);
  return response.data;
};

// 게시글 수정
export const updatePost = async (postId: number, data: Partial<CreatePostRequest>): Promise<Post> => {
  const response = await api.put(`/community/posts/${postId}`, data);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/community/posts/${postId}`);
};

// === 댓글 API ===

// 댓글 목록 조회
export const getComments = async (postId: number): Promise<Comment[]> => {
  const response = await api.get(`/community/posts/${postId}/comments`);
  return response.data;
};

// 댓글 작성
export const createComment = async (postId: number, data: CreateCommentRequest): Promise<Comment> => {
  const response = await api.post(`/community/posts/${postId}/comments`, data);
  return response.data;
};

// 댓글 수정
export const updateComment = async (commentId: number, content: string): Promise<Comment> => {
  const response = await api.put(`/community/comments/${commentId}`, { content });
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/community/comments/${commentId}`);
};

// === 추천/비추천 API ===

// 게시글 추천/비추천
export const votePost = async (postId: number, voteType: 'LIKE' | 'DISLIKE'): Promise<void> => {
  await api.post(`/community/posts/${postId}/vote`, { voteType });
};

// 게시글 추천/비추천 취소
export const unvotePost = async (postId: number): Promise<void> => {
  await api.delete(`/community/posts/${postId}/vote`);
};

// 댓글 추천/비추천
export const voteComment = async (commentId: number, voteType: 'LIKE' | 'DISLIKE'): Promise<void> => {
  await api.post(`/community/comments/${commentId}/vote`, { voteType });
};

// 댓글 추천/비추천 취소
export const unvoteComment = async (commentId: number): Promise<void> => {
  await api.delete(`/community/comments/${commentId}/vote`);
};

// === 모집 참여 API ===

// 모집 참여/취소 (토글)
export const toggleParticipation = async (postId: number): Promise<{ participated: boolean; currentCount: number }> => {
  const response = await api.post(`/community/posts/${postId}/participate`);
  return response.data;
};

// 참여자 목록 조회
export const getParticipants = async (postId: number): Promise<any[]> => {
  const response = await api.get(`/community/posts/${postId}/participants`);
  return response.data;
};

export default api;

