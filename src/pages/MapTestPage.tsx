import React, { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Grid, Card, CardContent, Chip } from '@mui/material';
import GoogleMap from '../components/GoogleMap';
import { useCurrentLocation, usePlacesSearch } from '../hooks/useGoogleMaps';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';

const MapTestPage: React.FC = () => {
  const [map] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [markers, setMarkers] = useState<Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
  }>>([]);

  const { location, loading: locationLoading, getCurrentLocation } = useCurrentLocation();
  const { results, loading: searchLoading, searchNearby, searchByText } = usePlacesSearch(map);
  
  const [searchQuery, setSearchQuery] = useState('');

  // 내 위치로 이동
  const handleMyLocation = () => {
    getCurrentLocation();
  };

  // 위치 업데이트
  React.useEffect(() => {
    if (location) {
      setCenter(location);
      setMarkers([{
        id: 'my-location',
        position: location,
        title: '내 위치',
      }]);
    }
  }, [location]);

  // 검색 결과를 마커로 표시
  React.useEffect(() => {
    if (results.length > 0) {
      const newMarkers = results.map((place, index) => ({
        id: place.place_id || `place-${index}`,
        position: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
        },
        title: place.name || '장소',
      }));
      setMarkers(newMarkers);
      
      // 첫 번째 결과 위치로 이동
      if (results[0]?.geometry?.location) {
        setCenter({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
      }
    }
  }, [results]);

  // 텍스트 검색
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchByText(searchQuery);
    }
  };

  // 주변 검색
  const handleNearbySearch = (type: string | undefined) => {
    searchNearby(center, 1000, type);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        구글 지도 테스트
      </Typography>

      <Grid container spacing={3}>
        {/* 왼쪽: 지도 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="장소 검색 (예: 강남역 맛집)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                disabled={searchLoading}
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

            <GoogleMap
              center={center}
              zoom={15}
              markers={markers}
              onMapClick={(lat, lng) => {
                console.log('클릭한 위치:', lat, lng);
                setMarkers([...markers, {
                  id: `click-${Date.now()}`,
                  position: { lat, lng },
                  title: '클릭한 위치',
                }]);
              }}
              style={{ width: '100%', height: '600px' }}
            />
          </Paper>
        </Grid>

        {/* 오른쪽: 카테고리 및 검색 결과 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              주변 장소 찾기
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="🍽️ 맛집"
                onClick={() => handleNearbySearch('restaurant')}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="☕ 카페"
                onClick={() => handleNearbySearch('cafe')}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="🏨 숙박"
                onClick={() => handleNearbySearch('lodging')}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="🏛️ 관광지"
                onClick={() => handleNearbySearch('tourist_attraction')}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="🏪 편의점"
                onClick={() => handleNearbySearch('convenience_store')}
                color="primary"
                variant="outlined"
              />
              <Chip
                label="🏥 병원"
                onClick={() => handleNearbySearch('hospital')}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              검색 결과 ({results.length})
            </Typography>
            <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              {searchLoading ? (
                <Typography>검색 중...</Typography>
              ) : results.length > 0 ? (
                results.map((place, index) => (
                  <Card key={place.place_id || index} sx={{ mb: 1 }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {place.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {place.vicinity}
                      </Typography>
                      {place.rating && (
                        <Typography variant="body2">
                          ⭐ {place.rating} ({place.user_ratings_total || 0}개 리뷰)
                        </Typography>
                      )}
                      {place.types && (
                        <Box sx={{ mt: 1 }}>
                          {place.types.slice(0, 3).map((type) => (
                            <Chip
                              key={type}
                              label={type}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography color="text.secondary">
                  검색 결과가 없습니다.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 현재 위치 정보 */}
      {location && (
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'success.light' }}>
          <Typography variant="body2">
            📍 현재 위치: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MapTestPage;

