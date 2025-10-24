// API Endpoints
// 상대 경로 사용 (Nginx 프록시를 통해 백엔드로 연결)
// 빈 문자열이면 상대 경로로 요청 (프로덕션 환경)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined 
  ? import.meta.env.VITE_API_BASE_URL 
  : '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// API Routes
export const API_ROUTES = {
  // User Service
  AUTH: {
    LOGIN: '/api/user/auth/login',
    REGISTER: '/api/user/auth/register',
    LOGOUT: '/api/user/auth/logout',
    REFRESH: '/api/user/auth/refresh',
    ME: '/api/user/auth/me',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/password',
    DELETE_ACCOUNT: '/api/user/account',
  },
  // Place Service
  PLACE: {
    LIST: '/api/place',
    DETAIL: (id: string) => `/api/place/${id}`,
    SEARCH: '/api/place/search',
    NEARBY: '/api/place/nearby',
    CATEGORIES: '/api/place/categories',
  },
  REVIEW: {
    LIST: (placeId: string) => `/api/place/${placeId}/reviews`,
    CREATE: (placeId: string) => `/api/place/${placeId}/reviews`,
    UPDATE: (placeId: string, reviewId: string) => `/api/place/${placeId}/reviews/${reviewId}`,
    DELETE: (placeId: string, reviewId: string) => `/api/place/${placeId}/reviews/${reviewId}`,
  },
  // Recommendation Service
  RECOMMENDATION: {
    PERSONALIZED: '/api/recommendation/personalized',
    TRENDING: '/api/recommendation/trending',
    NEARBY: '/api/recommendation/nearby',
  },
  // Community Service
  COMMUNITY: {
    POSTS: '/api/community/posts',
    POST_DETAIL: (id: string) => `/api/community/posts/${id}`,
    CREATE_POST: '/api/community/posts',
    UPDATE_POST: (id: string) => `/api/community/posts/${id}`,
    DELETE_POST: (id: string) => `/api/community/posts/${id}`,
    COMMENTS: (postId: string) => `/api/community/posts/${postId}/comments`,
    LIKE: (postId: string) => `/api/community/posts/${postId}/like`,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  MAX_SIZE: 50,
};

// Google Maps
export const MAP = {
  DEFAULT_CENTER: {
    lat: 37.5665,
    lng: 126.9780,
  }, // Seoul
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 8,
  MAX_ZOOM: 20,
};

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 20,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^01[0-9]{1}-?[0-9]{3,4}-?[0-9]{4}$/,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
};

// Categories
export const PLACE_CATEGORIES = {
  RESTAURANT: '맛집',
  CAFE: '카페',
  TOURIST: '관광지',
  CULTURE: '문화시설',
  SHOPPING: '쇼핑',
  ACCOMMODATION: '숙박',
  ETC: '기타',
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: '로그인에 성공했습니다.',
    LOGOUT: '로그아웃되었습니다.',
    REGISTER: '회원가입에 성공했습니다.',
    UPDATE_PROFILE: '프로필이 업데이트되었습니다.',
    CREATE_POST: '게시글이 작성되었습니다.',
    UPDATE_POST: '게시글이 수정되었습니다.',
    DELETE_POST: '게시글이 삭제되었습니다.',
    CREATE_REVIEW: '리뷰가 작성되었습니다.',
  },
  ERROR: {
    LOGIN: '로그인에 실패했습니다.',
    REGISTER: '회원가입에 실패했습니다.',
    NETWORK: '네트워크 오류가 발생했습니다.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
    VALIDATION: '입력값을 확인해주세요.',
  },
};

