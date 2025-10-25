import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Button, Card, CardContent, CircularProgress, Alert, Chip, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getMyPreferredRegions, PreferredRegion } from '../services/userService';
import { getCoordinatesByDistrict, DEFAULT_COORDINATE } from '../utils/regionCoordinates';
import { PLACE_CATEGORIES } from '../utils/placeCategories';
import { Place, getNearbyPlaces } from '../services/placeService';
import GoogleMap from '../components/GoogleMap';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [preferredRegions, setPreferredRegions] = useState<PreferredRegion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_COORDINATE);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [markers, setMarkers] = useState<Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
  }>>([]);
  const [radius, setRadius] = useState(3.0); // 기본 3km

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
      console.log('선호 지역 데이터:', data);
      setPreferredRegions(data.preferredRegions);
      
      // 1순위 선호 지역의 좌표 설정
      if (data.preferredRegions.length > 0) {
        const firstRegion = data.preferredRegions.find(r => r.priority === 1);
        console.log('1순위 지역:', firstRegion);
        if (firstRegion) {
          const coordinate = getCoordinatesByDistrict(firstRegion.district);
          console.log('1순위 지역 좌표:', coordinate);
          if (coordinate) {
            const center = {
              latitude: coordinate.latitude,
              longitude: coordinate.longitude,
            };
            setMapCenter(center);
            // 1순위 지역 주변 장소 자동 로드
            loadNearbyPlaces(center.latitude, center.longitude);
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

  // 주변 장소 로드
  const loadNearbyPlaces = async (lat: number, lng: number, categoryCode?: string) => {
    setLoadingPlaces(true);
    try {
      const nearbyPlaces = await getNearbyPlaces(lat, lng, radius);
      
      // API 응답 확인
      console.log('API 응답:', nearbyPlaces);
      
      // 배열인지 확인
      if (!Array.isArray(nearbyPlaces)) {
        console.error('API 응답이 배열이 아닙니다:', nearbyPlaces);
        setPlaces([]);
        setMarkers([]);
        return;
      }
      
      // 카테고리 필터링 (프론트엔드에서)
      let filteredPlaces = nearbyPlaces;
      if (categoryCode) {
        // TODO: 백엔드 카테고리 ID 매핑 필요
        filteredPlaces = nearbyPlaces;
      }
      
      setPlaces(filteredPlaces);
      
      // 마커 생성
      const newMarkers = filteredPlaces.map((place) => ({
        id: place.id.toString(),
        position: {
          lat: place.latitude,
          lng: place.longitude,
        },
        title: place.name,
      }));
      setMarkers(newMarkers);
    } catch (err: any) {
      console.error('주변 장소 로드 실패:', err);
      setPlaces([]);
      setMarkers([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  // 장소 검색 결과 업데이트
  useEffect(() => {
    if (places && Array.isArray(places) && places.length > 0) {
      const newMarkers = places.map((place) => ({
        id: place.id.toString(),
        position: {
          lat: place.latitude,
          lng: place.longitude,
        },
        title: place.name,
      }));
      setMarkers(newMarkers);
    }
  }, [places]);

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

      {/* 선호 지역 기반 지도 및 주변 장소 */}
      {isAuthenticated && preferredRegions.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon color="primary" />
              내 관심 지역 주변 장소
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                반경:
              </Typography>
              <Button
                size="small"
                variant={radius === 1 ? 'contained' : 'outlined'}
                onClick={async () => {
                  setRadius(1);
                  setLoadingPlaces(true);
                  try {
                    const nearbyPlaces = await getNearbyPlaces(mapCenter.latitude, mapCenter.longitude, 1);
                    if (Array.isArray(nearbyPlaces)) {
                      setPlaces(nearbyPlaces);
                    } else {
                      setPlaces([]);
                    }
                  } catch (err) {
                    console.error('장소 로드 실패:', err);
                    setPlaces([]);
                  } finally {
                    setLoadingPlaces(false);
                  }
                }}
              >
                1km
              </Button>
              <Button
                size="small"
                variant={radius === 3 ? 'contained' : 'outlined'}
                onClick={async () => {
                  setRadius(3);
                  setLoadingPlaces(true);
                  try {
                    const nearbyPlaces = await getNearbyPlaces(mapCenter.latitude, mapCenter.longitude, 3);
                    if (Array.isArray(nearbyPlaces)) {
                      setPlaces(nearbyPlaces);
                    } else {
                      setPlaces([]);
                    }
                  } catch (err) {
                    console.error('장소 로드 실패:', err);
                    setPlaces([]);
                  } finally {
                    setLoadingPlaces(false);
                  }
                }}
              >
                3km
              </Button>
              <Button
                size="small"
                variant={radius === 5 ? 'contained' : 'outlined'}
                onClick={async () => {
                  setRadius(5);
                  setLoadingPlaces(true);
                  try {
                    const nearbyPlaces = await getNearbyPlaces(mapCenter.latitude, mapCenter.longitude, 5);
                    if (Array.isArray(nearbyPlaces)) {
                      setPlaces(nearbyPlaces);
                    } else {
                      setPlaces([]);
                    }
                  } catch (err) {
                    console.error('장소 로드 실패:', err);
                    setPlaces([]);
                  } finally {
                    setLoadingPlaces(false);
                  }
                }}
              >
                5km
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => loadNearbyPlaces(mapCenter.latitude, mapCenter.longitude, selectedCategory || undefined)}
                disabled={loadingPlaces}
              >
                새로고침
              </Button>
            </Box>
          </Box>
          
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
                <GoogleMap
                  center={{ lat: mapCenter.latitude, lng: mapCenter.longitude }}
                  zoom={14}
                  markers={markers}
                  onMapClick={(lat, lng) => {
                    setMapCenter({ latitude: lat, longitude: lng });
                    loadNearbyPlaces(lat, lng, selectedCategory || undefined);
                  }}
                  style={{ width: '100%', height: '500px', borderRadius: '8px' }}
                />
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    현재 위치: {preferredRegions.find(r => {
                      const coord = getCoordinatesByDistrict(r.district);
                      return coord && coord.latitude === mapCenter.latitude && coord.longitude === mapCenter.longitude;
                    })?.districtName || preferredRegions.find(r => r.priority === 1)?.districtName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {loadingPlaces ? '장소 검색 중...' : `${places?.length || 0}개 장소 표시`}
                  </Typography>
                </Box>
              </Grid>
              
              {/* 선호 지역 목록 및 장소 목록 */}
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
                            loadNearbyPlaces(coordinate.latitude, coordinate.longitude, selectedCategory || undefined);
                          }
                        }}
                      >
                        이 지역 보기
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {/* 주변 장소 목록 */}
                {!loadingPlaces && (!places || places.length === 0) && (
                  <Alert severity="info" sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      주변에 등록된 장소가 없습니다
                    </Typography>
                    <Typography variant="caption">
                      • 다른 관심 지역을 선택해보세요<br />
                      • 지도를 클릭하여 다른 위치를 검색해보세요<br />
                      • 검색 반경을 늘려보세요 (현재: {radius}km)
                    </Typography>
                  </Alert>
                )}
                {places && places.length > 0 && (
                  <>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                      주변 장소 ({places.length})
                    </Typography>
                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {places.slice(0, 5).map((place) => (
                        <Card 
                          key={place.id} 
                          sx={{ 
                            mb: 1, 
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 3 }
                          }}
                          onClick={() => {
                            setMapCenter({ latitude: place.latitude, longitude: place.longitude });
                          }}
                        >
                          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {place.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {place.address}
                            </Typography>
                            {place.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                {place.description.length > 50 ? `${place.description.substring(0, 50)}...` : place.description}
                              </Typography>
                            )}
                            {place.averageRating && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                <Rating value={place.averageRating} precision={0.1} size="small" readOnly />
                                <Typography variant="caption">
                                  {place.averageRating.toFixed(1)} ({place.reviewCount || 0})
                                </Typography>
                              </Box>
                            )}
                            {place.categoryName && (
                              <Chip 
                                label={place.categoryName} 
                                size="small" 
                                sx={{ mt: 0.5 }} 
                              />
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      {places.length > 5 && (
                        <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ display: 'block', mt: 1 }}>
                          외 {places.length - 5}개 장소 (지도에서 확인)
                        </Typography>
                      )}
                    </Box>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Paper>
      )}

      {/* 주변장소 카테고리 (로그인한 경우에만 표시) */}
      {isAuthenticated && preferredRegions.length > 0 && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            카테고리별 장소 검색
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            관심있는 카테고리를 선택하면 위 지도에 해당 장소들이 표시됩니다
          </Typography>
          
          <Grid container spacing={2}>
            {PLACE_CATEGORIES.map((category) => (
              <Grid item xs={12} sm={6} md={2.4} key={category.code}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: selectedCategory === category.code ? '2px solid' : '1px solid',
                    borderColor: selectedCategory === category.code ? 'primary.main' : 'divider',
                    bgcolor: selectedCategory === category.code ? 'primary.light' : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => {
                    setSelectedCategory(category.code);
                    loadNearbyPlaces(mapCenter.latitude, mapCenter.longitude, category.code);
                    // 지도 섹션으로 스크롤
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ fontSize: 40, mb: 1, color: selectedCategory === category.code ? 'primary.main' : 'text.secondary' }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {selectedCategory && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Chip
                label={`선택된 카테고리: ${PLACE_CATEGORIES.find(c => c.code === selectedCategory)?.name}`}
                onDelete={() => {
                  setSelectedCategory(null);
                  loadNearbyPlaces(mapCenter.latitude, mapCenter.longitude);
                }}
                color="primary"
                sx={{ mr: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                위 지도에서 {PLACE_CATEGORIES.find(c => c.code === selectedCategory)?.name} 카테고리 장소를 확인하세요
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              🗺️ 주변 장소
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              내 관심 지역의 다양한 장소를 찾아보세요
            </Typography>
            <Button variant="contained" fullWidth>
              장소 탐색하기
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
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

