import { format, formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 포맷팅합니다.
 */
export const formatDate = (date: string | Date, formatStr: string = 'yyyy-MM-dd HH:mm'): string => {
  return format(new Date(date), formatStr, { locale: ko });
};

/**
 * 상대적인 시간을 표시합니다. (예: "5분 전")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko });
};

/**
 * 숫자를 포맷팅합니다. (예: 1000 -> "1,000")
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR');
};

/**
 * 전화번호를 포맷팅합니다.
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * 파일 크기를 읽기 쉽게 포맷팅합니다.
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * URL에서 쿼리 파라미터를 추출합니다.
 */
export const getQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * 객체를 쿼리 스트링으로 변환합니다.
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

/**
 * 로컬 스토리지에 저장합니다.
 */
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 로컬 스토리지에서 가져옵니다.
 */
export const getLocalStorage = <T = any>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * 로컬 스토리지에서 삭제합니다.
 */
export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * 로컬 스토리지를 모두 지웁니다.
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 이메일 유효성을 검사합니다.
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * 비밀번호 강도를 검사합니다.
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';
  
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  
  if (strength >= 3) return 'strong';
  if (strength >= 2) return 'medium';
  return 'weak';
};

/**
 * 문자열을 줄임표로 자릅니다.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * 거리를 포맷팅합니다. (미터 -> km 또는 m)
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)}km`;
  }
  return `${Math.round(meters)}m`;
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 쓰로틀 함수
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * 랜덤 문자열 생성
 */
export const generateRandomString = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * 이미지 URL 검증
 */
export const isValidImageUrl = (url: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};

/**
 * 깊은 복사
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

