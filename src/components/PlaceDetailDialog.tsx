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
} from '@mui/material';
import { Place as PlaceIcon, LocationOn, Category, Article } from '@mui/icons-material';
import { Place } from '../services/placeService';
import { getPostsByPlaceId, Post } from '../services/communityService';
import { useNavigate } from 'react-router-dom';

interface PlaceDetailDialogProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
}

const PlaceDetailDialog: React.FC<PlaceDetailDialogProps> = ({ place, open, onClose }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (place && open) {
      loadPosts();
    } else {
      setPosts([]);
      setError(null);
    }
  }, [place, open]);

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

          {place.averageRating && place.averageRating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Rating value={place.averageRating} precision={0.1} readOnly size="small" />
              <Typography variant="body2">
                {place.averageRating.toFixed(1)} ({place.reviewCount || 0}개 리뷰)
              </Typography>
            </Box>
          )}
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
    </Dialog>
  );
};

export default PlaceDetailDialog;

