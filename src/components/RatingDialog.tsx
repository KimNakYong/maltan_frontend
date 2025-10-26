import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { createReview, updateReview, Review } from '../services/reviewService';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  placeId: number;
  placeName: string;
  userId: number;
  userName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
}

const RatingDialog: React.FC<RatingDialogProps> = ({
  open,
  onClose,
  placeId,
  placeName,
  userId,
  userName,
  existingReview,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!existingReview;

  // 기존 리뷰 데이터 로드
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setContent(existingReview.content || '');
    } else {
      setRating(5);
      setContent('');
    }
    setError(null);
  }, [existingReview, open]);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('평점을 선택해주세요');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && existingReview) {
        // 리뷰 수정
        await updateReview(existingReview.id, {
          rating,
          content: content.trim() || undefined,
        });
      } else {
        // 리뷰 생성
        await createReview({
          placeId,
          userId,
          userName,
          rating,
          content: content.trim() || undefined,
        });
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('리뷰 저장 실패:', err);
      setError(err.response?.data?.message || '리뷰 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setContent('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star color="warning" />
          <Typography variant="h6" fontWeight="bold">
            {isEditMode ? '평점 수정' : '평점 작성'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {placeName}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 평점 선택 */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            이 장소는 어떠셨나요?
          </Typography>
          <Rating
            value={rating}
            onChange={(_, value) => setRating(value || 0)}
            size="large"
            precision={0.5}
          />
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            {rating > 0 ? `${rating}점` : '평점 선택'}
          </Typography>
        </Box>

        {/* 리뷰 내용 (선택사항) */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label="리뷰 내용 (선택사항)"
          placeholder="이 장소에 대한 솔직한 후기를 남겨주세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          inputProps={{ maxLength: 500 }}
          helperText={`${content.length}/500`}
        />

        {!isEditMode && (
          <Alert severity="info" sx={{ mt: 2 }}>
            한 장소당 1개의 평점만 작성할 수 있습니다.
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {isEditMode ? '수정' : '작성'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;

