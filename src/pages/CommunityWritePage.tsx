import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Chip,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { createPost, updatePost, getPost, CreatePostRequest } from '../services/communityService';
import { CITIES, DISTRICTS } from '../utils/regionData';
import { useAppSelector } from '../store/hooks';
import { Place, searchPlaces } from '../services/placeService';

const CommunityWritePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.auth);
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '자유',
    regionSi: 'seoul',
    regionGu: '',
    regionDong: '',
    isRecruitment: false,
    recruitmentMax: 5,
    recruitmentDeadline: null as Date | null,
    eventDate: null as Date | null,
    eventLocation: '',
    latitude: null as number | null,
    longitude: null as number | null,
    address: '',
  });

  const [selectedCityName, setSelectedCityName] = useState('서울특별시');

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [placeSearchInput, setPlaceSearchInput] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [placeOptions, setPlaceOptions] = useState<Place[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);

  const categories = ['자유', '질문', '정보', '모임', '봉사', '운동', '취미'];

  // 수정 모드일 때 기존 게시글 불러오기
  useEffect(() => {
    if (isEditMode && id) {
      fetchPost();
    }
  }, [isEditMode, id]);

  const fetchPost = async () => {
    if (!id) return;
    
    setInitialLoading(true);
    try {
      const post = await getPost(parseInt(id));
      
      // 작성자 확인 (타입 안전한 비교)
      const isAuthor = user?.id && post.userId 
        ? parseInt(user.id) === post.userId || user.id === post.userId.toString()
        : false;
      
      if (!isAuthor) {
        alert('본인이 작성한 글만 수정할 수 있습니다.');
        navigate(`/community/${id}`);
        return;
      }
      
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        regionSi: post.regionSi,
        regionGu: post.regionGu || '',
        regionDong: post.regionDong || '',
        isRecruitment: post.isRecruitment || false,
        recruitmentMax: post.recruitmentMax || 5,
        recruitmentDeadline: post.recruitmentDeadline ? new Date(post.recruitmentDeadline) : null,
        eventDate: post.eventDate ? new Date(post.eventDate) : null,
        eventLocation: post.eventLocation || '',
        latitude: post.latitude || null,
        longitude: post.longitude || null,
        address: post.address || '',
      });
      
      // 장소 정보가 있으면 표시 (수정 모드)
      if (post.address) {
        setPlaceSearchInput(post.eventLocation || post.address);
        // 임시 Place 객체 생성 (실제 DB에서 가져온 것이 아니므로)
        if (post.latitude && post.longitude) {
          setSelectedPlace({
            id: 0, // 임시 ID
            name: post.eventLocation || '선택된 장소',
            address: post.address,
            latitude: post.latitude,
            longitude: post.longitude,
          } as Place);
        }
      }
      
      // 시/도 이름 설정
      const city = CITIES.find(c => c.code === post.regionSi);
      if (city) {
        setSelectedCityName(city.name);
      }
    } catch (err: any) {
      console.error('게시글 조회 실패:', err);
      alert('게시글을 불러오는데 실패했습니다.');
      navigate('/community');
    } finally {
      setInitialLoading(false);
    }
  };

  // Place DB에서 장소 검색
  useEffect(() => {
    if (!placeSearchInput || placeSearchInput.length < 2) {
      setPlaceOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setPlaceLoading(true);
      try {
        const response = await searchPlaces(placeSearchInput, undefined, 0, 20);
        setPlaceOptions(response.content || []);
      } catch (err) {
        console.error('장소 검색 실패:', err);
        setPlaceOptions([]);
      } finally {
        setPlaceLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [placeSearchInput]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearLocation = () => {
    setSelectedPlace(null);
    setPlaceSearchInput('');
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      address: '',
    }));
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }
    if (formData.isRecruitment) {
      if (!formData.eventDate) {
        setError('모집 게시글은 활동 날짜를 입력해주세요.');
        return;
      }
      if (!formData.eventLocation.trim()) {
        setError('모집 게시글은 활동 장소를 입력해주세요.');
        return;
      }
      if (formData.recruitmentMax < 2) {
        setError('모집 인원은 최소 2명 이상이어야 합니다.');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const request: CreatePostRequest = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        regionSi: selectedCityName,
        regionGu: formData.regionGu ? DISTRICTS[formData.regionSi]?.find(d => d.code === formData.regionGu)?.name : undefined,
        regionDong: formData.regionDong || undefined,
        isRecruitment: formData.isRecruitment,
      };

      if (formData.isRecruitment) {
        request.recruitmentMax = formData.recruitmentMax;
        request.recruitmentDeadline = formData.recruitmentDeadline?.toISOString();
        request.eventDate = formData.eventDate?.toISOString();
        request.eventLocation = formData.eventLocation;
      }

      // 위치 정보 추가
      if (formData.latitude && formData.longitude) {
        request.latitude = formData.latitude;
        request.longitude = formData.longitude;
        request.address = formData.address;
      }

      // userId 추가 (임시: 인증 시스템 구현 전까지)
      if (user?.id) {
        request.userId = parseInt(user.id);
      }

      let post;
      if (isEditMode && id && user?.id) {
        post = await updatePost(parseInt(id), request, parseInt(user.id));
      } else {
        post = await createPost(request);
      }
      navigate(`/community/${post.id}`);
    } catch (err: any) {
      console.error(`게시글 ${isEditMode ? '수정' : '작성'} 실패:`, err);
      console.error('에러 응답:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || `게시글 ${isEditMode ? '수정' : '작성'}에 실패했습니다.`;
      setError(errorMsg);
      alert(errorMsg); // 임시: 에러 메시지 확인용
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {isEditMode ? '글 수정' : '글쓰기'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* 카테고리 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>카테고리</InputLabel>
              <Select
                value={formData.category}
                label="카테고리"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 지역 (시/도) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>지역 (시/도)</InputLabel>
              <Select
                value={formData.regionSi}
                label="지역 (시/도)"
                onChange={(e) => {
                  const cityCode = e.target.value;
                  const cityName = CITIES.find(c => c.code === cityCode)?.name || '';
                  handleChange('regionSi', cityCode);
                  setSelectedCityName(cityName);
                  handleChange('regionGu', ''); // 시/도 변경 시 구/군 초기화
                }}
              >
                {CITIES.map((city) => (
                  <MenuItem key={city.code} value={city.code}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* 지역 (구/군) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>지역 (구/군)</InputLabel>
              <Select
                value={formData.regionGu}
                label="지역 (구/군)"
                onChange={(e) => handleChange('regionGu', e.target.value)}
                disabled={!formData.regionSi}
              >
                <MenuItem value="">
                  <em>선택 안 함</em>
                </MenuItem>
                {DISTRICTS[formData.regionSi]?.map((district) => (
                  <MenuItem key={district.code} value={district.code}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="지역 (구/군) - 선택"
              value={formData.regionGu}
              onChange={(e) => handleChange('regionGu', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="지역 (동/면) - 선택"
              value={formData.regionDong}
              onChange={(e) => handleChange('regionDong', e.target.value)}
            />
          </Grid>

          {/* 모집 게시글 여부 */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isRecruitment}
                  onChange={(e) => handleChange('isRecruitment', e.target.checked)}
                />
              }
              label="모집 게시글 (활동/모임 인원 모집)"
            />
          </Grid>

          {/* 모집 관련 필드 */}
          {formData.isRecruitment && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="모집 인원"
                  value={formData.recruitmentMax}
                  onChange={(e) => handleChange('recruitmentMax', parseInt(e.target.value))}
                  inputProps={{ min: 2 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                  <DateTimePicker
                    label="모집 마감 (선택)"
                    value={formData.recruitmentDeadline}
                    onChange={(date) => handleChange('recruitmentDeadline', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
                  <DateTimePicker
                    label="활동 날짜 *"
                    value={formData.eventDate}
                    onChange={(date) => handleChange('eventDate', date)}
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="활동 장소"
                  value={formData.eventLocation}
                  onChange={(e) => handleChange('eventLocation', e.target.value)}
                />
              </Grid>
            </>
          )}

          {/* 제목 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="제목"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </Grid>

          {/* 내용 */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={12}
              label="내용"
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="내용을 입력하세요"
            />
          </Grid>

          {/* 장소 검색 (선택사항) */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              장소 추가 (선택사항)
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              등록된 장소 중에서 선택할 수 있습니다. (등록되지 않은 장소는 관리자 페이지에서 먼저 등록해주세요)
            </Typography>
            <Autocomplete
              fullWidth
              options={placeOptions}
              getOptionLabel={(option) => option.name}
              loading={placeLoading}
              value={selectedPlace}
              inputValue={placeSearchInput}
              onInputChange={(_event, newInputValue) => {
                setPlaceSearchInput(newInputValue);
              }}
              onChange={(_event, newValue) => {
                setSelectedPlace(newValue);
                if (newValue) {
                  setFormData((prev) => ({
                    ...prev,
                    latitude: newValue.latitude,
                    longitude: newValue.longitude,
                    address: newValue.address,
                  }));
                } else {
                  handleClearLocation();
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="장소 검색 (예: 스타벅스 강남점)"
                  placeholder="장소 이름이나 주소를 입력하세요 (2자 이상)"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="body1">{option.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.address}
                      {option.categoryName && ` • ${option.categoryName}`}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText={
                placeSearchInput.length < 2
                  ? "2자 이상 입력하세요"
                  : placeLoading
                  ? "검색 중..."
                  : "검색 결과가 없습니다"
              }
            />
            {selectedPlace && formData.address && (
              <Box sx={{ mt: 1 }}>
                <Chip
                  icon={<LocationOnIcon />}
                  label={`${selectedPlace.name} - ${formData.address}`}
                  onDelete={handleClearLocation}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
          </Grid>

          {/* 버튼 */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/community')}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '수정 완료' : '등록')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CommunityWritePage;

