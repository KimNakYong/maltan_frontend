import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  ToggleButtonGroup,
  ToggleButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock 데이터
const userGrowthData = [
  { month: '1월', users: 120, active: 80 },
  { month: '2월', users: 250, active: 180 },
  { month: '3월', users: 380, active: 290 },
  { month: '4월', users: 520, active: 410 },
  { month: '5월', users: 680, active: 550 },
  { month: '6월', users: 850, active: 690 },
  { month: '7월', users: 1020, active: 830 },
  { month: '8월', users: 1180, active: 960 },
  { month: '9월', users: 1320, active: 1080 },
  { month: '10월', users: 1450, active: 1190 },
];

const placesByCategoryData = [
  { name: '음식점', value: 450 },
  { name: '카페', value: 320 },
  { name: '관광지', value: 280 },
  { name: '문화시설', value: 180 },
  { name: '쇼핑', value: 150 },
  { name: '기타', value: 120 },
];

const regionDistributionData = [
  { region: '강남구', users: 280, places: 450 },
  { region: '마포구', users: 220, places: 380 },
  { region: '송파구', users: 190, places: 320 },
  { region: '강서구', users: 170, places: 280 },
  { region: '서초구', users: 160, places: 260 },
  { region: '기타', users: 430, places: 810 },
];

const dailyActivityData = [
  { time: '00:00', requests: 50 },
  { time: '03:00', requests: 30 },
  { time: '06:00', requests: 80 },
  { time: '09:00', requests: 350 },
  { time: '12:00', requests: 520 },
  { time: '15:00', requests: 480 },
  { time: '18:00', requests: 680 },
  { time: '21:00', requests: 450 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const StatisticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          통계
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={(_e, value) => value && setPeriod(value)}
            size="small"
          >
            <ToggleButton value="day">일간</ToggleButton>
            <ToggleButton value="week">주간</ToggleButton>
            <ToggleButton value="month">월간</ToggleButton>
            <ToggleButton value="year">연간</ToggleButton>
          </ToggleButtonGroup>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>지역</InputLabel>
            <Select
              value={selectedRegion}
              label="지역"
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="gangnam">강남구</MenuItem>
              <MenuItem value="mapo">마포구</MenuItem>
              <MenuItem value="songpa">송파구</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 주요 지표 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                총 사용자
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                1,450
              </Typography>
              <Typography variant="body2" color="success.main">
                +12.5% 전월 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                활성 사용자 (MAU)
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                1,190
              </Typography>
              <Typography variant="body2" color="success.main">
                82.1% 활성률
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                등록된 장소
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                1,500
              </Typography>
              <Typography variant="body2" color="success.main">
                +8.3% 전월 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                커뮤니티 글
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                3,280
              </Typography>
              <Typography variant="body2" color="success.main">
                +15.7% 전월 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 사용자 증가 추이 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              사용자 증가 추이
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="총 사용자"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="활성 사용자"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              카테고리별 장소 분포
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={placesByCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {placesByCategoryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 지역별 분포 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              지역별 사용자 및 장소 분포
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#8884d8" name="사용자" />
                <Bar dataKey="places" fill="#82ca9d" name="장소" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              시간대별 활동량
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#8884d8" name="요청 수" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* 상세 통계 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          상세 통계
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                평균 세션 시간
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                8분 32초
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                페이지뷰 (일평균)
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                12,450
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                이탈률
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                32.5%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                신규 방문자 비율
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                45.8%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StatisticsPage;

