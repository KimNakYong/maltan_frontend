import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { getDatabaseMetrics, DatabaseMetrics } from '../../services/monitoringService';
import { formatTime } from '../../utils/dateUtils';

const DatabasesPage: React.FC = () => {
  const [refreshTime, setRefreshTime] = useState<Date>(new Date());
  const [databaseMetrics, setDatabaseMetrics] = useState<DatabaseMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDatabaseMetrics();
      setDatabaseMetrics(data);
      setRefreshTime(new Date());
    } catch (err: any) {
      console.error('데이터베이스 메트릭 로드 실패:', err);
      setError('데이터베이스 메트릭을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
    
    // 10초마다 자동 새로고침
    const interval = setInterval(() => {
      loadMetrics();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && databaseMetrics.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h4" fontWeight="bold">
            데이터베이스 모니터링
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.5,
                  transform: 'scale(1.2)',
                },
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            마지막 업데이트: {formatTime(refreshTime)} (10초마다 자동 갱신)
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadMetrics}
            disabled={loading}
          >
            새로고침
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {databaseMetrics.map((db) => (
          <Grid item xs={12} md={6} lg={4} key={db.databaseName}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {db.databaseName}
                  </Typography>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor: db.status === 'running' ? 'success.light' : 'error.light',
                      color: db.status === 'running' ? 'success.dark' : 'error.dark',
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">
                      {db.status === 'running' ? '실행 중' : db.status}
                    </Typography>
                  </Box>
                </Box>

                {/* 연결 사용률 */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      연결 수
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {db.connections} / {db.maxConnections}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(db.connectionUsage, 100)}
                    color={db.connectionUsage < 50 ? 'success' : db.connectionUsage < 80 ? 'warning' : 'error'}
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    사용률: {db.connectionUsage.toFixed(1)}%
                  </Typography>
                </Box>

                {/* 추가 정보 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {db.type !== 'redis' && (
                    <>
                      <Typography variant="caption" color="text.secondary">
                        크기: {(db.databaseSize / (1024 * 1024)).toFixed(2)} MB
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        테이블: {db.tableCount}개 {db.tableCount === 0 && '(초기화 대기 중)'}
                      </Typography>
                    </>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    버전: {db.version}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    가동시간: {db.uptime}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DatabasesPage;

