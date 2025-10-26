import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { getMyPreferredRegions, PreferredRegion } from '../services/userService';
import MapIcon from '@mui/icons-material/Map';
import ForumIcon from '@mui/icons-material/Forum';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [preferredRegions, setPreferredRegions] = useState<PreferredRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 선호 지역 정보 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      fetchPreferredRegions();
    }
  }, [isAuthenticated]);

  const fetchPreferredRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyPreferredRegions();
      setPreferredRegions(data.preferredRegions);
    } catch (err: any) {
      console.error('선호 지역 조회 실패:', err);
      setError('선호 지역 정보를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

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
        {isAuthenticated && preferredRegions.length > 0 && (
          <Typography variant="body1">
            📍 관심 지역: {preferredRegions.map(r => r.districtName).join(', ')}
          </Typography>
        )}
      </Paper>

      {/* 로딩 및 에러 상태 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 관심 지역 정보 (로그인한 경우) */}
      {isAuthenticated && preferredRegions.length > 0 && !loading && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            내 관심 지역
          </Typography>
          <Grid container spacing={2}>
            {preferredRegions.map((region) => (
              <Grid item xs={12} sm={6} md={4} key={region.priority}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          bgcolor: region.priority === 1 ? 'primary.main' : 'grey.300',
                          color: region.priority === 1 ? 'white' : 'text.primary',
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                        }}
                      >
                        {region.priority}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {region.districtName}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {region.cityName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Box sx={{ fontSize: 48, mb: 2 }}>
              <MapIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              주변 장소 찾기
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              내 관심 지역의 맛집, 관광지, 문화시설을 지도에서 찾아보세요
            </Typography>
            <Button 
              variant="contained" 
              fullWidth
              size="large"
              onClick={() => navigate('/map-test')}
            >
              장소 탐색하기
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Box sx={{ fontSize: 48, mb: 2 }}>
              <ForumIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              커뮤니티
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              이웃들과 정보를 공유하고 소통해보세요
            </Typography>
            <Button
              variant="contained"
              fullWidth
              size="large"
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

