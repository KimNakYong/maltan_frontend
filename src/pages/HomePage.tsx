import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getMyPreferredRegions, PreferredRegion } from '../services/userService';
import { getCoordinatesByDistrict, DEFAULT_COORDINATE } from '../utils/regionCoordinates';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [preferredRegions, setPreferredRegions] = useState<PreferredRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_COORDINATE);

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
      
      // 1순위 선호 지역의 좌표 설정
      if (data.preferredRegions.length > 0) {
        const firstRegion = data.preferredRegions.find(r => r.priority === 1);
        if (firstRegion) {
          const coordinate = getCoordinatesByDistrict(firstRegion.district);
          if (coordinate) {
            setMapCenter({
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            });
          }
        }
      }
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

      {/* 선호 지역 기반 지도 및 추천 */}
      {isAuthenticated && preferredRegions.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnIcon color="primary" />
            내 관심 지역 추천
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {!loading && !error && (
            <Grid container spacing={3}>
              {/* 지도 */}
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    width: '100%',
                    height: 400,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <iframe
                    key={`${mapCenter.latitude}-${mapCenter.longitude}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${mapCenter.latitude},${mapCenter.longitude}&hl=ko&z=14&output=embed`}
                    allowFullScreen
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  현재 위치: {preferredRegions.find(r => {
                    const coord = getCoordinatesByDistrict(r.district);
                    return coord && coord.latitude === mapCenter.latitude && coord.longitude === mapCenter.longitude;
                  })?.districtName || preferredRegions.find(r => r.priority === 1)?.districtName}
                </Typography>
              </Grid>
              
              {/* 선호 지역 목록 */}
              <Grid item xs={12} md={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  내 관심 지역
                </Typography>
                {preferredRegions.map((region) => (
                  <Card key={region.priority} sx={{ mb: 2 }}>
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
                      <Button
                        size="small"
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1 }}
                        onClick={() => {
                          const coordinate = getCoordinatesByDistrict(region.district);
                          if (coordinate) {
                            setMapCenter({
                              latitude: coordinate.latitude,
                              longitude: coordinate.longitude,
                            });
                          }
                        }}
                      >
                        지도에서 보기
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

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

