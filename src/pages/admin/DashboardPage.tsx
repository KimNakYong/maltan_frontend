import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Forum,
  Speed,
  Memory,
  Storage,
} from '@mui/icons-material';
import { getDashboardStats, DashboardStats, getSystemMetrics, SystemMetrics } from '../../services/adminService';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change && change > 0;
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {value}
            </Typography>
            {change !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {isPositive ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={isPositive ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(change)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {React.cloneElement(icon, { sx: { color: `${color}.main` } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactElement;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const getColor = () => {
    if (value < 50) return 'success';
    if (value < 80) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {React.cloneElement(icon, { sx: { color: `${color}.main`, mr: 1 } })}
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {value.toFixed(1)}%
      </Typography>
      <LinearProgress
        variant="determinate"
        value={value}
        color={getColor()}
        sx={{ height: 8, borderRadius: 1 }}
      />
    </Paper>
  );
};

const DashboardPage: React.FC = () => {
  const [refreshTime, setRefreshTime] = useState<Date>(new Date());
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsData, metricsData] = await Promise.all([
        getDashboardStats(),
        getSystemMetrics(),
      ]);
      setStats(statsData);
      setMetrics(metricsData);
      setRefreshTime(new Date());
    } catch (err: any) {
      console.error('통계 로드 실패:', err);
      setError('통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    
    // 30초마다 자동 새로고침
    const interval = setInterval(() => {
      loadStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          실시간 모니터링
        </Typography>
        <Typography variant="body2" color="text.secondary">
          마지막 업데이트: {refreshTime.toLocaleTimeString()}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 주요 통계 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 사용자"
            value={stats?.totalUsers.toLocaleString() || '0'}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="정상 사용자"
            value={stats?.activeUsers.toLocaleString() || '0'}
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="차단된 사용자"
            value={stats?.inactiveUsers.toLocaleString() || '0'}
            icon={<People />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="커뮤니티 글"
            value={stats?.totalPosts.toLocaleString() || '0'}
            icon={<Forum />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* 시스템 리소스 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="CPU 사용률"
            value={metrics?.cpuUsage || 0}
            icon={<Speed />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="메모리 사용률"
            value={metrics?.memoryUsage || 0}
            icon={<Memory />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="디스크 사용률"
            value={metrics?.diskUsage || 0}
            icon={<Storage />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Speed sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                시스템 부하
              </Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {metrics?.systemLoadAverage.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              프로세서: {metrics?.availableProcessors || 0}개
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

