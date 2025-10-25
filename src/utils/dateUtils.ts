/**
 * 날짜 포맷 유틸리티 함수 (한국 시간대 기준)
 */

/**
 * 날짜를 한국 시간대로 포맷팅
 */
export const formatDate = (dateString?: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  if (!dateString) return '날짜 없음';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '잘못된 날짜';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  };
  
  return date.toLocaleString('ko-KR', { ...defaultOptions, ...options });
};

/**
 * 상대 시간 표시 (예: "방금 전", "3시간 전")
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return '방금 전';
  if (hours < 24) return `${hours}시간 전`;
  if (hours < 48) return '어제';
  
  return date.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });
};

/**
 * 짧은 날짜 포맷 (년-월-일)
 */
export const formatShortDate = (dateString?: string | Date): string => {
  if (!dateString) return '날짜 없음';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '잘못된 날짜';
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  });
};

/**
 * 시간만 표시
 */
export const formatTime = (dateString?: string | Date): string => {
  if (!dateString) return '시간 없음';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '잘못된 시간';
  
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul',
  });
};

/**
 * 날짜와 시간 모두 표시
 */
export const formatDateTime = (dateString?: string | Date): string => {
  if (!dateString) return '날짜 없음';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '잘못된 날짜';
  
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Seoul',
  });
};

