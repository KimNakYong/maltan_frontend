import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, Grid, Card, CardContent, Chip, CircularProgress, Alert, Rating } from '@mui/material';
import GoogleMap from '../components/GoogleMap';
import { useCurrentLocation } from '../hooks/useGoogleMaps';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import { Place, getNearbyPlaces, searchPlaces } from '../services/placeService';
import { PLACE_CATEGORIES } from '../utils/placeCategories';

const MapTestPage: React.FC = () => {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [markers, setMarkers] = useState<Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
  }>>([]);

  const { location, loading: locationLoading, getCurrentLocation } = useCurrentLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [radius, setRadius] = useState(5.0);

  // 내 위치로 이동
  const handleMyLocation = () => {
    getCurrentLocation();
  };

  // 위치 업데이트
  useEffect(() => {
    if (location) {
      setCenter(location);
      setMarkers([{
        id: 'my-location',
        position: location,
        title: '내 위치',
      }]);
      // 내 위치 기준으로 주변 장소 자동 검색
      handleNearbySearch(location.lat, location.lng);
    }
  }, [location]);

  // 장소 검색 결과를 마커로 표시
  useEffect(() => {
    if (places.length > 0) {
      const newMarkers = places.map((place) => ({
        id: place.id.toString(),
        position: {
          lat: place.latitude,
          lng: place.longitude,
        },
        title: place.name,
      }));
      setMarkers(newMarkers);
      
      // 첫 번째 결과 위치로 이동
      if (places[0]) {
        setCenter({
          lat: places[0].latitude,
          lng: places[0].longitude,
        });
      }
    }
  }, [places]);

  // 텍스트 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await searchPlaces(searchQuery, undefined, 0, 50);
      setPlaces(response.content);
    } catch (err: any) {
      console.error('장소 검색 실패:', err);
      setError('장소 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 주변 장소 검색
  const handleNearbySearch = async (lat?: number, lng?: number, categoryCode?: string) => {
    const searchLat = lat || center.lat;
    const searchLng = lng || center.lng;
    
    setLoading(true);
    setError(null);
    try {
      const nearbyPlaces = await getNearbyPlaces(searchLat, searchLng, radius);
      
      // 카테고리 필터링 (프론트엔드에서)
      let filteredPlaces = nearbyPlaces;
      if (categoryCode) {
        // TODO: 백엔드에서 카테고리 ID 매핑 필요
        // 현재는 모든 장소 표시
        filteredPlaces = nearbyPlaces;
      }
      
      setPlaces(filteredPlaces);
      setSelectedCategory(categoryCode || null);
    } catch (err: any) {
      console.error('주변 장소 검색 실패:', err);
      setError('주변 장소 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        장소 서비스 지도 테스트
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Place Service와 연동된 실제 장소 데이터를 지도에서 확인하세요
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 왼쪽: 지도 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="장소 검색 (예: 강남역 맛집)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{ flex: 1, minWidth: '200px' }}
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={loading}
              >
                검색
              </Button>
              <Button
                variant="outlined"
                startIcon={<MyLocationIcon />}
                onClick={handleMyLocation}
                disabled={locationLoading}
              >
                내 위치
              </Button>
            </Box>

            <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                검색 반경:
              </Typography>
              <TextField
                type="number"
                size="small"
                value={radius}
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                inputProps={{ min: 0.5, max: 50, step: 0.5 }}
                sx={{ width: '100px' }}
              />
              <Typography variant="body2" color="text.secondary">
                km
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleNearbySearch()}
                disabled={loading}
              >
                주변 검색
              </Button>
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            <GoogleMap
              center={center}
              zoom={14}
              markers={markers}
              onMapClick={(lat, lng) => {
                console.log('클릭한 위치:', lat, lng);
                setCenter({ lat, lng });
                handleNearbySearch(lat, lng);
              }}
              style={{ width: '100%', height: '600px' }}
            />
          </Paper>
        </Grid>

        {/* 오른쪽: 카테고리 및 검색 결과 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              카테고리별 검색
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {PLACE_CATEGORIES.map((category) => (
                <Chip
                  key={category.code}
                  icon={category.icon}
                  label={category.name}
                  onClick={() => handleNearbySearch(undefined, undefined, category.code)}
                  color={selectedCategory === category.code ? 'primary' : 'default'}
                  variant={selectedCategory === category.code ? 'filled' : 'outlined'}
                />
              ))}
              {selectedCategory && (
                <Chip
                  label="전체"
                  onClick={() => handleNearbySearch()}
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              검색 결과 ({places.length})
            </Typography>
            <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : places.length > 0 ? (
                places.map((place) => (
                  <Card 
                    key={place.id} 
                    sx={{ 
                      mb: 1, 
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 }
                    }}
                    onClick={() => {
                      setCenter({ lat: place.latitude, lng: place.longitude });
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {place.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {place.address}
                      </Typography>
                      {place.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {place.description}
                        </Typography>
                      )}
                      {place.averageRating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={place.averageRating} precision={0.1} size="small" readOnly />
                          <Typography variant="body2">
                            {place.averageRating.toFixed(1)} ({place.reviewCount || 0}개 리뷰)
                          </Typography>
                        </Box>
                      )}
                      {place.categoryName && (
                        <Chip
                          label={place.categoryName}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  검색 결과가 없습니다.
                  <br />
                  <Typography variant="caption">
                    내 위치 버튼을 클릭하거나 지도를 클릭하여 주변 장소를 검색하세요.
                  </Typography>
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 현재 위치 정보 */}
      {location && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light' }}>
          <Typography variant="body2">
            📍 현재 위치: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Typography>
        </Paper>
      )}

      {/* 통계 및 디버그 정보 */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              총 검색 결과
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {places.length}개
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              지도 중심
            </Typography>
            <Typography variant="body2">
              {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              검색 반경
            </Typography>
            <Typography variant="body2">
              {radius} km
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              API 상태
            </Typography>
            <Typography variant="body2" color={places.length > 0 ? 'success.main' : 'warning.main'}>
              {loading ? '검색 중...' : places.length > 0 ? '정상 연결' : 'DB 데이터 없음'}
            </Typography>
          </Grid>
        </Grid>
        
        {places.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Place Service DB에 데이터가 없거나 검색 범위 내에 장소가 없습니다
            </Typography>
            <Typography variant="caption">
              • API 엔드포인트: <code>/api/place-service/places/nearby</code><br />
              • 검색 위치: {center.lat.toFixed(6)}, {center.lng.toFixed(6)}<br />
              • 검색 반경: {radius}km<br />
              • 해결 방법: Place Service DB에 샘플 데이터를 추가하거나 다른 위치를 검색해보세요
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default MapTestPage;

