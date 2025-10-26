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
    if (data?.result && data.result.length > 0) {
      const value = parseFloat(data.result[0].value[1]);
      return isNaN(value) ? defaultValue : value;
    }
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};

// Prometheus 여러 결과 합산 (메모리 영역별 합산용)
const sumValues = (data: any): number => {
  try {
    if (data?.result && data.result.length > 0) {
      return data.result.reduce((sum: number, item: any) => {
        const value = parseFloat(item.value[1]);
        return sum + (isNaN(value) ? 0 : value);
      }, 0);
    }
    return 0;
  } catch (error) {
    return 0;
  }
};

// Prometheus 여러 결과 합산 (양수 값만, -1 제외)
const sumPositiveValues = (data: any): number => {
  try {
    if (data?.result && data.result.length > 0) {
      return data.result.reduce((sum: number, item: any) => {
        const value = parseFloat(item.value[1]);
        // -1이 아니고 유효한 숫자인 경우만 합산
        return sum + (isNaN(value) || value < 0 ? 0 : value);
      }, 0);
    }
    return 0;
  } catch (error) {
    return 0;
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

        // CPU Usage
        const cpuData = await queryPrometheus(`process_cpu_usage{job="${service}"}`);
        const cpuUsage = extractValue(cpuData, 0) * 100;

        // Memory Usage (G1 GC 영역별 합산)
        // G1 GC는 max가 -1인 영역이 있으므로 committed를 fallback으로 사용
        const memoryUsedData = await queryPrometheus(`jvm_memory_used_bytes{job="${service}",area="heap"}`);
        const memoryMaxData = await queryPrometheus(`jvm_memory_max_bytes{job="${service}",area="heap"}`);
        const memoryCommittedData = await queryPrometheus(`jvm_memory_committed_bytes{job="${service}",area="heap"}`);
        
        const memoryUsed = sumValues(memoryUsedData);
        let memoryLimit = sumPositiveValues(memoryMaxData); // -1 제외하고 합산
        
        // max가 모두 -1이면 committed 사용
        if (memoryLimit <= 0) {
          memoryLimit = sumValues(memoryCommittedData);
        }
        
        const memoryUsage = memoryLimit > 0 ? (memoryUsed / memoryLimit) * 100 : 0;

        return {
          serviceName: service,
          status: isUp ? 'UP' : 'DOWN',
          uptime: `${uptimeHours}h ${uptimeMinutes}m`,
          requestRate: extractValue(requestRateData, 0),
          errorRate: extractValue(errorRateData, 0),
          responseTime: extractValue(responseTimeData, 0),
          cpuUsage: cpuUsage,
          memoryUsage: memoryUsage,
          memoryUsed: memoryUsed / (1024 * 1024), // MB로 변환
          memoryLimit: memoryLimit / (1024 * 1024), // MB로 변환
        };
      } catch (error) {
        return {
          serviceName: service,
          status: 'UNKNOWN',
          uptime: 'N/A',
          requestRate: 0,
          errorRate: 0,
          responseTime: 0,
          cpuUsage: 0,
          memoryUsage: 0,
          memoryUsed: 0,
          memoryLimit: 0,
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
 * 데이터베이스 메트릭 조회 (HikariCP 메트릭 활용)
 */
export const getDatabaseMetrics = async (): Promise<DatabaseMetrics[]> => {
  try {
    const databases: DatabaseMetrics[] = [];
    
    // MySQL - User Service와 Place Service의 HikariCP 메트릭 조회
    const mysqlServices = ['user-service', 'place-service'];
    let mysqlTotalActive = 0;
    let mysqlTotalMax = 0;
    let mysqlTotalConnections = 0;
    let mysqlUptime = 0;
    let mysqlStatus = 'DOWN';
    
    for (const service of mysqlServices) {
      try {
        const activeData = await queryPrometheus(`hikaricp_connections_active{job="${service}"}`);
        const maxData = await queryPrometheus(`hikaricp_connections_max{job="${service}"}`);
        const connectionsData = await queryPrometheus(`hikaricp_connections{job="${service}"}`);
        const uptimeData = await queryPrometheus(`process_uptime_seconds{job="${service}"}`);
        
        const active = extractValue(activeData, 0);
        const max = extractValue(maxData, 0);
        const connections = extractValue(connectionsData, 0);
        const uptime = extractValue(uptimeData, 0);
        
        console.log(`[DB 메트릭] ${service}: active=${active}, max=${max}, connections=${connections}`);
        
        if (max > 0) {
          mysqlStatus = 'UP';
          mysqlTotalActive += active;
          mysqlTotalMax += max;
          mysqlTotalConnections += connections;
          if (uptime > mysqlUptime) mysqlUptime = uptime;
        }
      } catch (error) {
        console.error(`[DB 메트릭 에러] ${service}:`, error);
      }
    }
    
    databases.push({
      databaseName: 'MySQL (User/Place)',
      type: 'mysql',
      status: mysqlStatus,
      connections: Math.round(mysqlTotalConnections), // 전체 풀 연결 수
      maxConnections: Math.round(mysqlTotalMax),
      connectionUsage: mysqlTotalMax > 0 ? (mysqlTotalActive / mysqlTotalMax) * 100 : 0,
      databaseSize: 0, // DB exporter 필요
      tableCount: 0, // DB exporter 필요
      version: '8.0',
      uptime: Math.round(mysqlUptime),
    });
    
    // PostgreSQL - Community Service와 Recommendation Service의 HikariCP 메트릭 조회
    const pgServices = ['community-service', 'recommendation-service'];
    let pgTotalActive = 0;
    let pgTotalMax = 0;
    let pgTotalConnections = 0;
    let pgUptime = 0;
    let pgStatus = 'DOWN';
    
    for (const service of pgServices) {
      try {
        const activeData = await queryPrometheus(`hikaricp_connections_active{job="${service}"}`);
        const maxData = await queryPrometheus(`hikaricp_connections_max{job="${service}"}`);
        const connectionsData = await queryPrometheus(`hikaricp_connections{job="${service}"}`);
        const uptimeData = await queryPrometheus(`process_uptime_seconds{job="${service}"}`);
        
        const active = extractValue(activeData, 0);
        const max = extractValue(maxData, 0);
        const connections = extractValue(connectionsData, 0);
        const uptime = extractValue(uptimeData, 0);
        
        console.log(`[DB 메트릭] ${service}: active=${active}, max=${max}, connections=${connections}`);
        
        if (max > 0) {
          pgStatus = 'UP';
          pgTotalActive += active;
          pgTotalMax += max;
          pgTotalConnections += connections;
          if (uptime > pgUptime) pgUptime = uptime;
        }
      } catch (error) {
        console.error(`[DB 메트릭 에러] ${service}:`, error);
      }
    }
    
    databases.push({
      databaseName: 'PostgreSQL (Community/Recommendation)',
      type: 'postgresql',
      status: pgStatus,
      connections: Math.round(pgTotalConnections), // 전체 풀 연결 수
      maxConnections: Math.round(pgTotalMax),
      connectionUsage: pgTotalMax > 0 ? (pgTotalActive / pgTotalMax) * 100 : 0,
      databaseSize: 0, // DB exporter 필요
      tableCount: 0, // DB exporter 필요
      version: '15.0',
      uptime: Math.round(pgUptime),
    });
    
    // Redis - Gateway Service가 UP이면 Redis도 UP으로 간주
    try {
      const gatewayUpData = await queryPrometheus(`up{job="gateway-service"}`);
      const isGatewayUp = extractValue(gatewayUpData, 0) === 1;
      
      databases.push({
        databaseName: 'Redis',
        type: 'redis',
        status: isGatewayUp ? 'UP' : 'DOWN',
        connections: 0, // Redis는 HikariCP 메트릭 없음
        maxConnections: 10000,
        connectionUsage: 0,
        databaseSize: 0,
        tableCount: 0,
        version: '7.0',
        uptime: 0,
      });
    } catch (error) {
      databases.push({
        databaseName: 'Redis',
        type: 'redis',
        status: 'UNKNOWN',
        connections: 0,
        maxConnections: 10000,
        connectionUsage: 0,
        databaseSize: 0,
        tableCount: 0,
        version: '7.0',
        uptime: 0,
      });
    }
    
    return databases;
  } catch (error) {
    console.error('데이터베이스 메트릭 조회 실패:', error);
    return [];
  }
};

/**
 * 시스템 로그 조회 (Loki API 사용)
 */
export const getSystemLogs = async (
  limit: number = 50,
  service?: string,
  level?: string
): Promise<SystemLog[]> => {
  try {
    const LOKI_URL = '/api/loki';
    
    // LogQL 쿼리 생성
    let query = '{container=~".+"}'; // 모든 컨테이너
    
    // 서비스 필터
    if (service && service !== 'all') {
      query = `{service="${service.toLowerCase()}-service"}`;
    }
    
    // 레벨 필터 (로그 내용에서 검색)
    if (level && level !== 'all') {
      query += ` |~ "${level}"`;
    }
    
    // Loki query_range API 호출
    const end = Math.floor(Date.now() / 1000); // 현재 시간 (초)
    const start = end - 600; // 10분 전 (로그 양 감소)
    
    // Nginx 프록시: /api/loki/ → http://localhost:3100/
    // 따라서 /api/loki/api/v1/query_range → http://localhost:3100/api/v1/query_range
    const response = await axios.get(`${LOKI_URL}/api/v1/query_range`, {
      params: {
        query: query,
        start: start * 1000000000, // 나노초로 변환
        end: end * 1000000000,
        limit: limit,
        direction: 'backward', // 최신 로그부터
      },
    });
    
    if (response.data?.data?.result) {
      const logs: SystemLog[] = [];
      
      response.data.data.result.forEach((stream: any) => {
        const labels = stream.stream;
        const serviceName = labels.service || labels.container || 'unknown';
        
        stream.values.forEach((value: any, index: number) => {
          const [timestamp, message] = value;
          
          // 로그 레벨 추출
          let logLevel = 'INFO';
          if (message.includes('ERROR')) logLevel = 'ERROR';
          else if (message.includes('WARN')) logLevel = 'WARNING';
          else if (message.includes('DEBUG')) logLevel = 'DEBUG';
          
          logs.push({
            id: `${timestamp}-${index}`,
            timestamp: new Date(parseInt(timestamp) / 1000000).toISOString(), // 나노초를 밀리초로 변환
            level: logLevel,
            service: serviceName,
            message: message,
          });
        });
      });
      
      // 시간 역순 정렬
      return logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
    
    return [];
  } catch (error) {
    console.error('Loki 로그 조회 실패:', error);
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
