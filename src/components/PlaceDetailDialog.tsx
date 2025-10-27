import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  ImageList,
  ImageListItem,
  LinearProgress,
} from '@mui/material';
import { Place as PlaceIcon, LocationOn, Category, Article, Image, Star, Edit } from '@mui/icons-material';
import { Place } from '../services/placeService';
import { getPostsByPlaceId, Post } from '../services/communityService';
import { getUserReviewForPlace, Review } from '../services/reviewService';
import RatingDialog from './RatingDialog';
import { useAppSelector } from '../store/hooks';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

interface PlaceDetailDialogProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
}

const PlaceDetailDialog: React.FC<PlaceDetailDialogProps> = ({ place, open, onClose }) => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 평점 관련 state
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [checkingReview, setCheckingReview] = useState(false);

  useEffect(() => {
    if (place && open) {
      loadPosts();
      checkUserReview();
    } else {
      setPosts([]);
      setUserReview(null);
      setError(null);
    }
  }, [place, open, user]);

  const loadPosts = async () => {
    if (!place) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getPostsByPlaceId(place.id);
      setPosts(response.content || []);
    } catch (err: any) {
      console.error('장소 게시글 로드 실패:', err);
      setError('게시글을 불러오는데 실패했습니다.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    if (!place || !user?.id) {
      setUserReview(null);
      return;
    }

    setCheckingReview(true);
    try {
      const userId = parseInt(user.id);
      const review = await getUserReviewForPlace(place.id, userId);
      setUserReview(review);
    } catch (err: any) {
      console.error('사용자 리뷰 확인 실패:', err);
      setUserReview(null);
    } finally {
      setCheckingReview(false);
    }
  };

  const handleReviewSuccess = () => {
    checkUserReview();
    // 장소 정보를 새로고침하여 평균 평점 업데이트 (선택사항)
  };

  const handlePostClick = (postId: number) => {
    navigate(`/community/${postId}`);
    onClose();
  };

  if (!place) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PlaceIcon color="primary" />
          <Typography variant="h5" fontWeight="bold">
            {place.name}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* 장소 이미지 */}
        {place.photos && place.photos.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Image color="primary" />
              <Typography variant="h6" fontWeight="bold">
                장소 사진
              </Typography>
            </Box>
            <ImageList cols={3} rowHeight={164} gap={8}>
              {place.photos.map((photo) => (
                <ImageListItem key={photo.id}>
                  <img
                    src={
                      photo.filePath?.startsWith('https://') 
                        ? photo.filePath  // GCS URL은 그대로 사용
                        : `${API_URL}/uploads/${photo.filePath}`  // 로컬 파일은 API_URL과 결합
                    }
                    alt={photo.originalName || '장소 이미지'}
                    loading="lazy"
                    style={{ objectFit: 'cover', height: '164px', borderRadius: '4px' }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        )}

        {/* 장소 기본 정보 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationOn color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {place.address}
            </Typography>
          </Box>

          {place.categoryName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Category color="action" fontSize="small" />
              <Chip label={place.categoryName} size="small" color="primary" variant="outlined" />
            </Box>
          )}

          {place.description && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {place.description}
            </Typography>
          )}

          {/* 평점 정보 */}
          <Box sx={{ mt: 2 }}>
            {place.averageRating && place.averageRating > 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={place.averageRating} precision={0.1} readOnly size="small" />
                <Typography variant="body2">
                  {place.averageRating.toFixed(1)} ({place.reviewCount || 0}개 평점)
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                아직 평점이 없습니다
              </Typography>
            )}

            {/* 내 평점 표시 */}
            {checkingReview ? (
              <LinearProgress sx={{ mt: 1, height: 2 }} />
            ) : user && userReview ? (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'primary.light', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star color="warning" fontSize="small" />
                  <Typography variant="body2" fontWeight="bold">
                    내 평점: {userReview.rating}점
                  </Typography>
                  {userReview.content && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      "{userReview.content.substring(0, 30)}{userReview.content.length > 30 ? '...' : ''}"
                    </Typography>
                  )}
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setRatingDialogOpen(true)}
                >
                  수정
                </Button>
              </Box>
            ) : user ? (
              <Button
                size="small"
                variant="contained"
                color="warning"
                startIcon={<Star />}
                onClick={() => setRatingDialogOpen(true)}
                sx={{ mt: 1 }}
              >
                평점 남기기
              </Button>
            ) : null}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 커뮤니티 게시글 */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Article color="primary" />
            <Typography variant="h6" fontWeight="bold">
              이 장소의 커뮤니티 게시글 ({posts.length})
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress size={30} />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : posts.length > 0 ? (
            <List sx={{ maxHeight: '300px', overflowY: 'auto' }}>
              {posts.map((post) => (
                <ListItem
                  key={post.id}
                  button
                  onClick={() => handlePostClick(post.id)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="bold">
                        {post.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {post.userName || `사용자 ${post.userId}`} • {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip label={post.category} size="small" variant="outlined" />
                          {post.isRecruitment && (
                            <Chip
                              label={`모집 ${post.recruitmentCurrent}/${post.recruitmentMax}`}
                              size="small"
                              color="secondary"
                            />
                          )}
                          <Typography variant="caption" color="text.secondary">
                            👁️ {post.viewCount} 💬 {post.commentCount}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              이 장소와 연결된 게시글이 아직 없습니다.
              <br />
              첫 번째 게시글을 작성해보세요!
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        <Button
          variant="contained"
          onClick={() => {
            navigate('/community/write', { state: { selectedPlace: place } });
            onClose();
          }}
        >
          이 장소에 게시글 작성
        </Button>
      </DialogActions>

      {/* 평점 작성/수정 Dialog */}
      {user && place && (
        <RatingDialog
          open={ratingDialogOpen}
          onClose={() => setRatingDialogOpen(false)}
          placeId={place.id}
          placeName={place.name}
          userId={parseInt(user.id)}
          userName={user.name || user.email}
          existingReview={userReview}
          onSuccess={handleReviewSuccess}
        />
      )}
    </Dialog>
  );
};

export default PlaceDetailDialog;

