import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h3" gutterBottom fontWeight="bold">
          우리동네 소개 서비스
        </Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>
          당신 주변의 맛집, 관광지, 문화시설을 찾아보세요
        </Typography>
        {isAuthenticated && user?.address && (
          <Typography variant="body1">
            📍 내 동네: {user.address}
          </Typography>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              🍽️ 맛집 탐색
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              우리 동네 숨은 맛집을 찾아보세요
            </Typography>
            <Button variant="contained" fullWidth>
              맛집 보기
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              🗺️ 관광지
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              주변 가볼만한 곳을 추천해드려요
            </Typography>
            <Button variant="contained" fullWidth>
              관광지 보기
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              💬 커뮤니티
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              이웃들과 정보를 공유해보세요
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/community')}
            >
              커뮤니티 가기
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {!isAuthenticated && (
        <Paper sx={{ p: 4, mt: 4, textAlign: 'center', bgcolor: 'info.light' }}>
          <Typography variant="h6" gutterBottom>
            아직 회원이 아니신가요?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            회원가입하고 우리 동네의 다양한 정보를 확인하세요!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
          >
            회원가입 하기
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage;

