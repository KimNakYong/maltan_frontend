import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Place,
  Forum,
  Speed,
  Memory,
  Storage,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock 데이터 (실제로는 API에서 가져옴)
const mockSystemMetrics = {
  cpu: 45,
  memory: 68,
  disk: 52,
  network: 34,
};

const mockStats = {
  totalUsers: 1234,
  activeUsers: 456,
  totalPlaces: 5678,
  totalPosts: 9012,
  usersChange: 12.5,
  placesChange: -3.2,
  postsChange: 8.7,
};

const mockTrafficData = [
  { time: '00:00', requests: 120, errors: 2 },
  { time: '04:00', requests: 80, errors: 1 },
  { time: '08:00', requests: 350, errors: 5 },
  { time: '12:00', requests: 520, errors: 8 },
  { time: '16:00', requests: 680, errors: 12 },
  { time: '20:00', requests: 450, errors: 6 },
];

const mockResponseTimeData = [
  { time: '00:00', user: 120, place: 150, community: 180, recommendation: 200 },
  { time: '04:00', user: 110, place: 140, community: 170, recommendation: 190 },
  { time: '08:00', user: 130, place: 160, community: 190, recommendation: 220 },
  { time: '12:00', user: 150, place: 180, community: 210, recommendation: 250 },
  { time: '16:00', user: 140, place: 170, community: 200, recommendation: 230 },
  { time: '20:00', user: 125, place: 155, community: 185, recommendation: 210 },
];

const mockServiceStatus = [
  { name: 'User Service', status: 'healthy', uptime: '99.9%', responseTime: '120ms' },
  { name: 'Place Service', status: 'healthy', uptime: '99.8%', responseTime: '150ms' },
  { name: 'Recommendation Service', status: 'warning', uptime: '98.5%', responseTime: '250ms' },
  { name: 'Community Service', status: 'healthy', uptime: '99.7%', responseTime: '180ms' },
  { name: 'Gateway Service', status: 'healthy', uptime: '99.9%', responseTime: '80ms' },
];

const mockRecentErrors = [
  { time: '2분 전', service: 'Recommendation', error: 'Connection timeout', level: 'warning' },
  { time: '15분 전', service: 'Place', error: 'Database slow query', level: 'info' },
  { time: '1시간 전', service: 'User', error: 'Rate limit exceeded', level: 'warning' },
];

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
        {value}%
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

  useEffect(() => {
    // 30초마다 자동 새로고침
    const interval = setInterval(() => {
      setRefreshTime(new Date());
      // 실제로는 여기서 API 호출
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

      {/* 주요 통계 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="총 사용자"
            value={mockStats.totalUsers.toLocaleString()}
            change={mockStats.usersChange}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="활성 사용자"
            value={mockStats.activeUsers.toLocaleString()}
            icon={<People />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="등록된 장소"
            value={mockStats.totalPlaces.toLocaleString()}
            change={mockStats.placesChange}
            icon={<Place />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="커뮤니티 글"
            value={mockStats.totalPosts.toLocaleString()}
            change={mockStats.postsChange}
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
            value={mockSystemMetrics.cpu}
            icon={<Speed />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="메모리 사용률"
            value={mockSystemMetrics.memory}
            icon={<Memory />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="디스크 사용률"
            value={mockSystemMetrics.disk}
            icon={<Storage />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="네트워크 사용률"
            value={mockSystemMetrics.network}
            icon={<Speed />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* 트래픽 차트 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              API 요청 추이
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockTrafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="requests"
                  stroke="#8884d8"
                  fill="#8884d8"
                  name="요청 수"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="#ff7300"
                  fill="#ff7300"
                  name="에러 수"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              서비스별 응답 시간
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockResponseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="user" stroke="#8884d8" name="User" />
                <Line type="monotone" dataKey="place" stroke="#82ca9d" name="Place" />
                <Line type="monotone" dataKey="community" stroke="#ffc658" name="Community" />
                <Line type="monotone" dataKey="recommendation" stroke="#ff7300" name="Recommendation" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 서비스 상태 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              서비스 상태
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>서비스</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell>가동률</TableCell>
                    <TableCell>평균 응답시간</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockServiceStatus.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={service.status === 'healthy' ? '정상' : '경고'}
                          color={service.status === 'healthy' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{service.uptime}</TableCell>
                      <TableCell>{service.responseTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              최근 에러
            </Typography>
            <Box>
              {mockRecentErrors.map((error, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    pb: 2,
                    borderBottom: index < mockRecentErrors.length - 1 ? '1px solid #eee' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {error.service}
                    </Typography>
                    <Chip
                      label={error.level}
                      size="small"
                      color={error.level === 'warning' ? 'warning' : 'info'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {error.error}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {error.time}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;

