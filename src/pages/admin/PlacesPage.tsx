import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  MyLocation as MyLocationIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import {
  Place,
  PlacePhoto,
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  uploadPlaceImage,
  deletePlaceImage,
} from '../../services/placeService';
import { Category, getCategoriesWithCount } from '../../services/categoryService';
import GoogleMap from '../../components/GoogleMap';

const PlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    categoryId: '',
    phone: '',
    website: '',
    openingHours: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [mapMarker, setMapMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [placePhotos, setPlacePhotos] = useState<PlacePhoto[]>([]);

  // 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [placesData, categoriesData] = await Promise.all([
        getAllPlaces({ page: 0, size: 100 }),
        getCategoriesWithCount(),
      ]);
      setPlaces(placesData.content);
      setCategories(categoriesData);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 다이얼로그 열기
  const handleOpenDialog = (place?: Place) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        name: place.name,
        description: place.description || '',
        address: place.address,
        latitude: place.latitude.toString(),
        longitude: place.longitude.toString(),
        categoryId: place.categoryId.toString(),
        phone: place.phone || '',
        website: place.website || '',
        openingHours: place.openingHours || '',
      });
      // 지도 중심과 마커 설정
      setMapCenter({ lat: place.latitude, lng: place.longitude });
      setMapMarker({ lat: place.latitude, lng: place.longitude });
      // 기존 이미지 로드
      setPlacePhotos(place.photos || []);
    } else {
      setEditingPlace(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        categoryId: '',
        phone: '',
        website: '',
        openingHours: '',
      });
      // 지도 초기화
      setMapCenter({ lat: 37.5665, lng: 126.978 });
      setMapMarker(null);
      setPlacePhotos([]);
    }
    setOpenDialog(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlace(null);
    setPlacePhotos([]);
  };

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
  };

  // 지도 클릭 이벤트 - 위도/경도 자동 입력 및 주소 역산
  const handleMapClick = async (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
    }));
    setMapCenter({ lat, lng });
    setMapMarker({ lat, lng });

    // Geocoding API로 주소 가져오기
    setGeocoding(true);
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      
      if (response.results && response.results.length > 0) {
        const address = response.results[0].formatted_address;
        setFormData((prev) => ({
          ...prev,
          address: address,
        }));
        toast.success('위치와 주소가 설정되었습니다');
      } else {
        toast.error('주소를 가져올 수 없습니다. 직접 입력해주세요.');
      }
    } catch (error) {
      console.error('Geocoding 실패:', error);
      toast.error('주소를 가져오는데 실패했습니다');
    } finally {
      setGeocoding(false);
    }
  };

  // 내 위치로 이동
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          handleMapClick(lat, lng);
        },
        (error) => {
          console.error('위치 가져오기 실패:', error);
          toast.error('현재 위치를 가져올 수 없습니다');
        }
      );
    } else {
      toast.error('브라우저가 위치 서비스를 지원하지 않습니다');
    }
  };

  // 장소 저장
  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.latitude || !formData.longitude || !formData.categoryId) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    try {
      const placeData = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        categoryId: parseInt(formData.categoryId),
        phone: formData.phone,
        website: formData.website,
        openingHours: formData.openingHours,
        isActive: true,
      };

      let savedPlace: Place;
      if (editingPlace) {
        savedPlace = await updatePlace(editingPlace.id, placeData);
        toast.success('장소가 수정되었습니다');
        
        // 수정된 장소의 photos를 유지하기 위해 places 배열 업데이트
        setPlaces((prevPlaces) =>
          prevPlaces.map((p) =>
            p.id === savedPlace.id ? { ...savedPlace, photos: placePhotos } : p
          )
        );
      } else {
        savedPlace = await createPlace(placeData);
        toast.success('장소가 추가되었습니다');
        
        // 새로 추가된 장소를 places 배열에 추가
        setPlaces((prevPlaces) => [savedPlace, ...prevPlaces]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다');
    }
  };

  // 장소 삭제
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deletePlace(id);
      toast.success('장소가 삭제되었습니다');
      loadData();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다');
    }
  };

  // 카테고리 이름 찾기
  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || '알 수 없음';
  };

  // 이미지 업로드
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPlace) {
      toast.error('장소를 먼저 저장한 후 이미지를 업로드할 수 있습니다');
      return;
    }

    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const file = files[0];
      const uploadedPhoto = await uploadPlaceImage(editingPlace.id, file);
      setPlacePhotos((prev) => [...prev, uploadedPhoto]);
      toast.success('이미지가 업로드되었습니다');
      
      // 장소 목록 새로고침
      loadData();
    } catch (error: any) {
      console.error('이미지 업로드 실패:', error);
      toast.error(error.response?.data?.message || '이미지 업로드에 실패했습니다');
    } finally {
      setUploadingImage(false);
      // input 초기화
      event.target.value = '';
    }
  };

  // 이미지 삭제
  const handleImageDelete = async (photoId: number) => {
    if (!editingPlace) return;
    if (!confirm('이미지를 삭제하시겠습니까?')) return;

    try {
      await deletePlaceImage(editingPlace.id, photoId);
      setPlacePhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success('이미지가 삭제되었습니다');
      
      // 장소 목록 새로고침
      loadData();
    } catch (error: any) {
      console.error('이미지 삭제 실패:', error);
      toast.error('이미지 삭제에 실패했습니다');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          장소 관리
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            sx={{ mr: 1 }}
          >
            새로고침
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            장소 추가
          </Button>
        </Box>
      </Box>

      {/* 통계 */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="primary">
              {places.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              전체 장소
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="success.main">
              {places.filter((p) => p.isActive).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              활성 장소
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h3" color="info.main">
              {categories.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              카테고리 수
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 장소 목록 테이블 */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell>ID</TableCell>
                <TableCell>장소명</TableCell>
                <TableCell>카테고리</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>위치</TableCell>
                <TableCell align="center">평점</TableCell>
                <TableCell align="center">리뷰수</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : places.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">등록된 장소가 없습니다</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                places.map((place) => (
                  <TableRow key={place.id} hover>
                    <TableCell>{place.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">{place.name}</Typography>
                      {place.description && (
                        <Typography variant="caption" color="text.secondary">
                          {place.description.substring(0, 30)}...
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={getCategoryName(place.categoryId)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{place.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={place.averageRating?.toFixed(1) || '0.0'}
                        size="small"
                        color={place.averageRating && place.averageRating >= 4 ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">{place.reviewCount || 0}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={place.isActive ? '활성' : '비활성'}
                        size="small"
                        color={place.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="수정">
                        <IconButton size="small" onClick={() => handleOpenDialog(place)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="삭제">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(place.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 장소 추가/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>{editingPlace ? '장소 수정' : '장소 추가'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* 왼쪽: 지도 */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">지도에서 위치 선택</Typography>
                  <Button
                    size="small"
                    startIcon={<MyLocationIcon />}
                    onClick={handleMyLocation}
                    variant="outlined"
                  >
                    내 위치
                  </Button>
                </Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="caption">
                    지도를 클릭하면 위도/경도와 주소가 자동으로 입력됩니다
                  </Typography>
                </Alert>
                {geocoding && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} />
                      <Typography variant="caption">주소를 가져오는 중...</Typography>
                    </Box>
                  </Alert>
                )}
                <GoogleMap
                  center={mapCenter}
                  zoom={15}
                  markers={
                    mapMarker
                      ? [
                          {
                            id: 'selected',
                            position: mapMarker,
                            title: '선택된 위치',
                          },
                        ]
                      : []
                  }
                  onMapClick={handleMapClick}
                  style={{ width: '100%', height: '400px', borderRadius: '4px' }}
                />
              </Paper>
            </Grid>

            {/* 오른쪽: 폼 */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="장소명"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>카테고리</InputLabel>
                    <Select value={formData.categoryId} onChange={handleSelectChange} label="카테고리">
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="전화번호"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="02-1234-5678"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="주소"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    helperText="지도 클릭 시 자동 입력됩니다"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="위도"
                    name="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    required
                    placeholder="37.5665"
                    inputProps={{ step: 'any' }}
                    helperText="지도 클릭 시 자동 입력"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="경도"
                    name="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    required
                    placeholder="126.978"
                    inputProps={{ step: 'any' }}
                    helperText="지도 클릭 시 자동 입력"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="설명"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="웹사이트"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="영업시간"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    placeholder="09:00 - 18:00"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* 이미지 관리 (편집 모드에서만) */}
            {editingPlace && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">장소 이미지</Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<PhotoCameraIcon />}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? '업로드 중...' : '이미지 추가'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                  </Box>

                  {placePhotos.length === 0 ? (
                    <Alert severity="info">
                      등록된 이미지가 없습니다. 이미지를 추가해주세요.
                    </Alert>
                  ) : (
                    <Grid container spacing={2}>
                      {placePhotos.map((photo) => (
                        <Grid item xs={6} sm={4} md={3} key={photo.id}>
                          <Paper
                            sx={{
                              position: 'relative',
                              paddingTop: '100%',
                              overflow: 'hidden',
                              '&:hover .delete-button': {
                                opacity: 1,
                              },
                            }}
                          >
                            <Box
                              component="img"
                              src={photo.fileUrl || `/uploads/${photo.filePath}`}
                              alt={photo.originalName || '장소 이미지'}
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                            <IconButton
                              className="delete-button"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                bgcolor: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                opacity: 0,
                                transition: 'opacity 0.2s',
                                '&:hover': {
                                  bgcolor: 'rgba(0, 0, 0, 0.8)',
                                },
                              }}
                              onClick={() => handleImageDelete(photo.id)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.5 }}>
                            {photo.originalName || `image-${photo.id}.jpg`}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>취소</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingPlace ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PlacesPage;

