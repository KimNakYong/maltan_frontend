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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import {
  Place,
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} from '../../services/placeService';
import { Category, getCategoriesWithCount } from '../../services/categoryService';

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
    }
    setOpenDialog(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlace(null);
  };

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
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

      if (editingPlace) {
        await updatePlace(editingPlace.id, placeData);
        toast.success('장소가 수정되었습니다');
      } else {
        await createPlace(placeData);
        toast.success('장소가 추가되었습니다');
      }

      handleCloseDialog();
      loadData();
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
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingPlace ? '장소 수정' : '장소 추가'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
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
              <TextField
                fullWidth
                label="주소"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
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
              />
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
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="caption">
              위도/경도는 <a href="https://www.google.com/maps" target="_blank" rel="noopener">구글 지도</a>에서 
              장소를 우클릭하여 확인할 수 있습니다.
            </Typography>
          </Alert>
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

