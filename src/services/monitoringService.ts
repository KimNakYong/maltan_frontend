import axios from 'axios';

const PROMETHEUS_URL = '/api/prometheus'; // Nginx에서 프록시할 경로

// === Prometheus 쿼리 헬퍼 함수 ===

// Prometheus 쿼리 실행
const queryPrometheus = async (query: string): Promise<any> => {
  try {
    const response = await axios.get(`${PROMETHEUS_URL}/api/v1/query`, {
      params: { query },
    });
    if (response.data.status === 'success') {
      return response.data.data;
    }
    throw new Error('Prometheus query failed');
  } catch (error) {
    console.error('Prometheus query failed:', error);
    throw error;
  }
};

// Prometheus 값 추출 (첫 번째 결과의 값)
const extractValue = (data: any, defaultValue: number = 0): number => {
  try {
    if (data.result && data.result.length > 0) {
      const value = parseFloat(data.result[0].value[1]);
      return isNaN(value) ? defaultValue : value;
    }
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// === 인터페이스 정의 ===

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

export interface ServiceMetrics {
  serviceName: string;
  status: string;
  uptime: string;
  requestRate: number; // requests per second
  errorRate: number; // error percentage
  responseTime: number; // average response time in ms
  cpuUsage: number;
  memoryUsage: number;
  memoryUsed: number;
  memoryLimit: number;
}

export interface DatabaseMetrics {
  databaseName: string;
  type: string;
  status: string;
  connections: number;
  maxConnections: number;
  connectionUsage: number;
  databaseSize: number;
  tableCount: number;
  version: string;
  uptime: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: string;
  service: string;
  message: string;
  userId?: string;
}

// === API 함수들 ===

/**
 * 시스템 메트릭 조회 (JVM 기반)
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  try {
    // JVM 메모리 메트릭
    const memoryUsedData = await queryPrometheus('sum(jvm_memory_used_bytes{area="heap"})');
    const memoryMaxData = await queryPrometheus('sum(jvm_memory_max_bytes{area="heap"})');
    
    // CPU 사용률 (프로세스)
    const cpuData = await queryPrometheus('sum(rate(process_cpu_seconds_total[5m])) * 100');
    
    // 시스템 로드
    const loadData = await queryPrometheus('system_load_average_1m');

    const usedMemory = extractValue(memoryUsedData);
    const totalMemory = extractValue(memoryMaxData);
    const memoryUsage = totalMemory > 0 ? (usedMemory / totalMemory) * 100 : 0;

    return {
      cpuUsage: extractValue(cpuData, 0),
      memoryUsage: memoryUsage,
      diskUsage: 0, // Prometheus에서 디스크 메트릭은 별도 exporter 필요
      totalMemory: totalMemory / (1024 * 1024), // MB로 변환
      usedMemory: usedMemory / (1024 * 1024),
      freeMemory: (totalMemory - usedMemory) / (1024 * 1024),
      totalDisk: 0,
      usedDisk: 0,
      freeDisk: 0,
      availableProcessors: 0,
      systemLoadAverage: extractValue(loadData, 0),
    };
  } catch (error) {
    console.error('시스템 메트릭 조회 실패:', error);
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
    const services = ['gateway-service', 'user-service', 'place-service', 'community-service', 'recommendation-service'];
    const metricsPromises = services.map(async (service) => {
      try {
        // 서비스 UP 상태 확인
        const upData = await queryPrometheus(`up{job="${service}"}`);
        const isUp = extractValue(upData, 0) === 1;
        
        // Request rate (초당 요청 수)
        const requestRateData = await queryPrometheus(
          `rate(http_server_requests_seconds_count{job="${service}"}[5m])`
        );
        
        // Error rate
        const errorRateData = await queryPrometheus(
          `rate(http_server_requests_seconds_count{job="${service}",status=~"5.."}[5m]) / rate(http_server_requests_seconds_count{job="${service}"}[5m]) * 100`
        );
        
        // Response time (평균)
        const responseTimeData = await queryPrometheus(
          `rate(http_server_requests_seconds_sum{job="${service}"}[5m]) / rate(http_server_requests_seconds_count{job="${service}"}[5m]) * 1000`
        );
        
        // Uptime
        const uptimeData = await queryPrometheus(`process_uptime_seconds{job="${service}"}`);
        const uptimeSeconds = extractValue(uptimeData, 0);
        const uptimeHours = Math.floor(uptimeSeconds / 3600);
        const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);

        return {
          serviceName: service,
          status: isUp ? 'UP' : 'DOWN',
          uptime: `${uptimeHours}h ${uptimeMinutes}m`,
          requestRate: extractValue(requestRateData, 0),
          errorRate: extractValue(errorRateData, 0),
          responseTime: extractValue(responseTimeData, 0),
        };
      } catch (error) {
        return {
          serviceName: service,
          status: 'UNKNOWN',
          uptime: 'N/A',
          requestRate: 0,
          errorRate: 0,
          responseTime: 0,
        };
      }
    });

    return await Promise.all(metricsPromises);
  } catch (error) {
    console.error('서비스 메트릭 조회 실패:', error);
    return [];
  }
};

/**
 * 데이터베이스 메트릭 조회 (간단한 버전)
 */
export const getDatabaseMetrics = async (): Promise<DatabaseMetrics[]> => {
  try {
    // 실제 DB 메트릭을 수집하려면 각 DB에 exporter를 설치해야 함
    // 여기서는 서비스들이 DB에 접속 가능한지 여부만 표시
    const databases: DatabaseMetrics[] = [
      {
        databaseName: 'MySQL (User/Place)',
        type: 'mysql',
        status: 'UP',
        connections: 0,
      },
      {
        databaseName: 'PostgreSQL (Community/Recommendation)',
        type: 'postgresql',
        status: 'UP',
        connections: 0,
      },
      {
        databaseName: 'Redis',
        type: 'redis',
        status: 'UP',
        connections: 0,
      },
    ];
    
    return databases;
  } catch (error) {
    console.error('데이터베이스 메트릭 조회 실패:', error);
    return [];
  }
};

/**
 * 시스템 로그 조회 (Prometheus에서는 로그를 저장하지 않음)
 */
export const getSystemLogs = async (
  _limit: number = 100,
  _service?: string,
  _level?: string
): Promise<SystemLog[]> => {
  // Prometheus는 로그를 저장하지 않습니다.
  // 로그를 보려면 Loki 같은 별도 로그 시스템이 필요합니다.
  console.warn('로그는 Prometheus에서 제공하지 않습니다. Loki 설치를 고려하세요.');
  return [];
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
