import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ko } from 'date-fns/locale';
import { createPost, CreatePostRequest } from '../services/communityService';

const CommunityWritePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '자유',
    regionSi: '서울특별시',
    regionGu: '',
    regionDong: '',
    isRecruitment: false,
    recruitmentMax: 5,
    recruitmentDeadline: null as Date | null,
    eventDate: null as Date | null,
    eventLocation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['자유', '질문', '정보', '모임', '봉사', '운동', '취미'];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        regionSi: formData.regionSi,
        regionGu: formData.regionGu || undefined,
        regionDong: formData.regionDong || undefined,
        isRecruitment: formData.isRecruitment,
      };

      if (formData.isRecruitment) {
        request.recruitmentMax = formData.recruitmentMax;
        request.recruitmentDeadline = formData.recruitmentDeadline?.toISOString();
        request.eventDate = formData.eventDate?.toISOString();
        request.eventLocation = formData.eventLocation;
      }

      const post = await createPost(request);
      navigate(`/community/${post.id}`);
    } catch (err: any) {
      console.error('게시글 작성 실패:', err);
      setError(err.response?.data?.message || '게시글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        글쓰기
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

          {/* 지역 */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="지역 (시/도)"
              value={formData.regionSi}
              onChange={(e) => handleChange('regionSi', e.target.value)}
            />
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
                {loading ? '작성 중...' : '등록'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CommunityWritePage;

