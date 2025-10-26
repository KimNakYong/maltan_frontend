import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// === 시스템 모니터링 API ===

// 시스템 메트릭
export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  totalMemory: number;
  usedMemory: number;
  freeMemory: number;
  totalDisk: number;
  usedDisk: number;
  freeDisk: number;
  availableProcessors: number;
  systemLoadAverage: number;
}

// 서비스별 메트릭
export interface ServiceMetrics {
  serviceName: string;
  status: string;
  cpuUsage: number;
  memoryUsage: number;
  memoryLimit: number;
  memoryUsed: number;
  uptime: string;
}

// 데이터베이스 메트릭
export interface DatabaseMetrics {
  databaseName: string;
  type: string; // mysql, postgresql, redis
  status: string;
  connections: number;
  maxConnections: number;
  connectionUsage: number;
  databaseSize: number;
  tableCount: number;
  version: string;
  uptime: string;
}

// 시스템 로그
export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  userId: string | null;
}

/**
 * 시스템 메트릭 조회
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  try {
    const response = await api.get('/api/monitoring/system/metrics');
    return response.data.data || response.data;
  } catch (error) {
    console.error('시스템 메트릭 조회 실패:', error);
    // 에러 시 기본값 반환
    return {
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      totalMemory: 0,
      usedMemory: 0,
      freeMemory: 0,
      totalDisk: 0,
      usedDisk: 0,
      freeDisk: 0,
      availableProcessors: 0,
      systemLoadAverage: 0,
    };
  }
};

/**
 * 서비스별 메트릭 조회
 */
export const getServicesMetrics = async (): Promise<ServiceMetrics[]> => {
  try {
    const response = await api.get('/api/monitoring/services/metrics');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('서비스 메트릭 조회 실패:', error);
    // 에러 시 빈 배열 반환
    return [];
  }
};

/**
 * 데이터베이스 메트릭 조회
 */
export const getDatabaseMetrics = async (): Promise<DatabaseMetrics[]> => {
  try {
    const response = await api.get('/api/monitoring/databases/metrics');
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('데이터베이스 메트릭 조회 실패:', error);
    return [];
  }
};

/**
 * 시스템 로그 조회
 */
export const getSystemLogs = async (
  limit: number = 100,
  service?: string,
  level?: string
): Promise<SystemLog[]> => {
  try {
    const params: any = { limit };
    if (service && service !== 'all') params.service = service;
    if (level && level !== 'all') params.level = level;
    
    const response = await api.get('/api/monitoring/logs', { params });
    return response.data.data || response.data || [];
  } catch (error) {
    console.error('시스템 로그 조회 실패:', error);
    return [];
  }
};

/**
 * 모든 모니터링 데이터 조회 (대시보드용)
 */
export const getAllMonitoringData = async () => {
  try {
    const [systemMetrics, servicesMetrics, databaseMetrics] = await Promise.all([
      getSystemMetrics(),
      getServicesMetrics(),
      getDatabaseMetrics(),
    ]);

    return {
      systemMetrics,
      servicesMetrics,
      databaseMetrics,
    };
  } catch (error) {
    console.error('모니터링 데이터 조회 실패:', error);
    throw error;
  }
};

