import React, { useState, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { getUserStats, getCommunityStats, UserStats, CommunityStats } from '../../services/adminService';

const StatisticsPage: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [users, community] = await Promise.all([
        getUserStats(),
        getCommunityStats(),
      ]);
      setUserStats(users);
      setCommunityStats(community);
    } catch (error) {
      console.error('통계 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
                {userStats?.totalUsers.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                활성: {userStats?.activeUsers || 0}명
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                커뮤니티 게시글
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {communityStats?.totalPosts.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                모집: {communityStats?.totalRecruitmentPosts || 0}개
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                댓글
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {communityStats?.totalComments.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전체 댓글 수
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom variant="body2">
                활동 지표
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {communityStats?.totalVotes.toLocaleString() || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                총 투표 수
              </Typography>
            </CardContent>
          </Card>
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
                관리자 계정
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {userStats?.adminUsers || 0}명
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                활성 모집 게시글
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {communityStats?.activeRecruitmentPosts || 0}개
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                총 참여자 수
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {communityStats?.totalParticipants || 0}명
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                활성률
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {userStats && userStats.totalUsers > 0
                  ? ((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)
                  : 0}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default StatisticsPage;

