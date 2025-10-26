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
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { location, loading: locationLoading, getCurrentLocation } = useCurrentLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 내 위치로 이동
  const handleMyLocation = () => {
    getCurrentLocation();
  };

  // 위치 업데이트
  useEffect(() => {
    if (location && map) {
      setCenter(location);
      map.panTo(location);
    }
  }, [location, map]);


  // 텍스트 검색
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await searchPlaces(searchQuery, undefined, 0, 50);
      const searchResults = response.content;
      
      if (searchResults.length > 0 && map) {
        // 검색 결과의 범위를 계산하여 지도에 표시
        const bounds = new window.google.maps.LatLngBounds();
        searchResults.forEach((place) => {
          bounds.extend(new window.google.maps.LatLng(place.latitude, place.longitude));
        });
        map.fitBounds(bounds);
        
        // 마커 생성
        const newMarkers = searchResults.map((place) => ({
          id: place.id.toString(),
          position: {
            lat: place.latitude,
            lng: place.longitude,
          },
          title: place.name,
        }));
        setMarkers(newMarkers);
      }
      
      setPlaces(searchResults);
      setSelectedCategory(null); // 검색 시 카테고리 필터 해제
    } catch (err: any) {
      console.error('장소 검색 실패:', err);
      setError('장소 검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 지도 범위 기반 장소 로드
  const loadPlacesInBounds = async (bounds: google.maps.LatLngBounds, categoryCode?: string) => {
    setLoading(true);
    setError(null);
    try {
      // 지도 중심점과 반경 계산
      const center = bounds.getCenter();
      const ne = bounds.getNorthEast();
      
      // 대각선 거리를 반경으로 사용 (km 단위) - 여유있게 1.5배 확장
      const radius = (window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(center.lat(), center.lng()),
        new window.google.maps.LatLng(ne.lat(), ne.lng())
      ) / 1000) * 1.5;
      
      // categoryCode를 categoryId로 변환
      const categoryId = categoryCode 
        ? PLACE_CATEGORIES.find(c => c.code === categoryCode)?.id 
        : undefined;
      
      console.log('지도 범위 기반 검색:', { 
        center: { lat: center.lat(), lng: center.lng() },
        radius,
        categoryCode, 
        categoryId 
      });
      
      // categoryId를 백엔드로 전달
      const nearbyPlaces = await getNearbyPlaces(center.lat(), center.lng(), radius, categoryId);
      
      // 배열인지 확인
      if (!Array.isArray(nearbyPlaces)) {
        console.error('API 응답이 배열이 아닙니다:', nearbyPlaces);
        setPlaces([]);
        setMarkers([]);
        return;
      }
      
      // 현재 지도 범위 내에 있는 장소만 필터링
      const placesInView = nearbyPlaces.filter((place) => {
        const placeLatLng = new window.google.maps.LatLng(place.latitude, place.longitude);
        return bounds.contains(placeLatLng);
      });
      
      console.log(`전체 장소: ${nearbyPlaces.length}, 화면 내 장소: ${placesInView.length}`);
      
      setPlaces(placesInView);
      setSelectedCategory(categoryCode || null);
      
      // 화면 내 장소에 대해서만 마커 생성
      const newMarkers = placesInView.map((place) => ({
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
      setError('주변 장소 검색에 실패했습니다.');
      setPlaces([]);
      setMarkers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        주변 장소 찾기
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        지도에서 주변의 맛집, 관광지, 문화시설을 검색하고 탐색하세요
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

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            <GoogleMap
              center={center}
              zoom={14}
              markers={markers}
              onMapLoad={(mapInstance: google.maps.Map) => {
                setMap(mapInstance);
                // 지도 로드 시 초기 장소 로드
                const bounds = mapInstance.getBounds();
                if (bounds) {
                  loadPlacesInBounds(bounds, selectedCategory || undefined);
                }
              }}
              onBoundsChanged={(mapInstance: google.maps.Map) => {
                // 지도 이동/확대/축소 시 장소 로드
                const bounds = mapInstance.getBounds();
                if (bounds) {
                  loadPlacesInBounds(bounds, selectedCategory || undefined);
                }
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
                  onClick={() => {
                    if (map) {
                      const bounds = map.getBounds();
                      if (bounds) {
                        loadPlacesInBounds(bounds, category.code);
                      }
                    }
                  }}
                  color={selectedCategory === category.code ? 'primary' : 'default'}
                  variant={selectedCategory === category.code ? 'filled' : 'outlined'}
                />
              ))}
              {selectedCategory && (
                <Chip
                  label="전체"
                  onClick={() => {
                    if (map) {
                      const bounds = map.getBounds();
                      if (bounds) {
                        loadPlacesInBounds(bounds);
                      }
                    }
                  }}
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

      {/* 통계 정보 */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              화면 내 장소
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {places.length}개
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              지도 중심
            </Typography>
            <Typography variant="body2">
              {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              검색 상태
            </Typography>
            <Typography variant="body2" color={places.length > 0 ? 'success.main' : 'warning.main'}>
              {loading ? '검색 중...' : places.length > 0 ? '검색 완료' : '장소 없음'}
            </Typography>
          </Grid>
        </Grid>
        
        {places.length === 0 && !loading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              현재 지도 범위에 등록된 장소가 없습니다
            </Typography>
            <Typography variant="caption">
              • 지도를 이동하거나 축소하여 더 넓은 범위를 확인해보세요<br />
              • 카테고리 필터를 해제해보세요<br />
              • 텍스트 검색을 이용해보세요
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default MapTestPage;

