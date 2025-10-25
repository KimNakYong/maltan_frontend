import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Place,
  Event,
  Group,
  Visibility,
  Edit,
  Delete,
  Send,
} from '@mui/icons-material';
import {
  getPost,
  deletePost,
  Post,
  getComments,
  createComment,
  Comment,
  votePost,
  unvotePost,
  toggleParticipation,
} from '../services/communityService';
import { useAppSelector } from '../store/hooks';
import { formatDate } from '../utils/dateUtils';

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [myVote, setMyVote] = useState<'LIKE' | 'DISLIKE' | null>(null);
  const [participated, setParticipated] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const data = await getPost(parseInt(id));
      setPost(data);
    } catch (err: any) {
      console.error('게시글 조회 실패:', err);
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!id) return;

    try {
      const data = await getComments(parseInt(id));
      setComments(data);
    } catch (err: any) {
      console.error('댓글 조회 실패:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!id || !post || !user?.id) return;

    try {
      await deletePost(parseInt(id), parseInt(user.id));
      navigate('/community');
    } catch (err: any) {
      alert(err.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
    setDeleteDialogOpen(false);
  };

  const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!id || !user?.id) return;
    const userId = parseInt(user.id);

    try {
      if (myVote === voteType) {
        // 같은 투표 취소
        await unvotePost(parseInt(id), userId);
        setMyVote(null);
        setPost(prev => prev ? {
          ...prev,
          likeCount: voteType === 'LIKE' ? prev.likeCount - 1 : prev.likeCount,
          dislikeCount: voteType === 'DISLIKE' ? prev.dislikeCount - 1 : prev.dislikeCount,
        } : null);
      } else {
        // 새로운 투표 또는 변경
        await votePost(parseInt(id), voteType, userId);
        setPost(prev => {
          if (!prev) return null;
          let newLikeCount = prev.likeCount;
          let newDislikeCount = prev.dislikeCount;

          if (myVote === 'LIKE') newLikeCount--;
          if (myVote === 'DISLIKE') newDislikeCount--;
          if (voteType === 'LIKE') newLikeCount++;
          if (voteType === 'DISLIKE') newDislikeCount++;

          return {
            ...prev,
            likeCount: newLikeCount,
            dislikeCount: newDislikeCount,
          };
        });
        setMyVote(voteType);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '추천/비추천에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleParticipate = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!id || !user?.id) return;
    const userId = parseInt(user.id);

    try {
      const result = await toggleParticipation(parseInt(id), userId);
      setParticipated(result.participated);
      setPost(prev => prev ? {
        ...prev,
        recruitmentCurrent: result.currentCount,
      } : null);
    } catch (err: any) {
      alert(err.response?.data?.message || '참여 처리에 실패했습니다.');
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (!id) return;

    try {
      await createComment(parseInt(id), {
        content: newComment,
        parentCommentId: replyTo || undefined,
        userId: user?.id ? parseInt(user.id) : undefined,  // 임시: 로그인한 사용자 ID 전달
      });
      setNewComment('');
      setReplyTo(null);
      fetchComments();
      setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
    } catch (err: any) {
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.');
    }
  };


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || '게시글을 찾을 수 없습니다.'}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/community')}>
            목록으로 돌아가기
          </Button>
        </Box>
      </Container>
    );
  }

  const isAuthor = user?.id && post?.userId 
    ? parseInt(user.id) === post.userId || user.id === post.userId.toString()
    : false;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* 게시글 헤더 */}
      <Paper elevation={2} sx={{ p: 4, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={post.category} color="primary" size="small" />
          {post.isRecruitment && (
            <Chip
              label={`모집 ${post.recruitmentCurrent || 0}/${post.recruitmentMax || 0}`}
              color={(post.recruitmentCurrent || 0) >= (post.recruitmentMax || 0) ? 'error' : 'success'}
              size="small"
              icon={<Group />}
            />
          )}
          <Chip
            label={`${post.regionGu || post.regionSi}`}
            size="small"
            icon={<Place />}
          />
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {post.userName ? post.userName[0] : 'U'}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {post.userName || `사용자${post.userId}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.createdAt)}
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span style={{ marginLeft: '4px', color: '#666' }}>
                  (수정됨: {formatDate(post.updatedAt)})
                </span>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">•</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Visibility fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {post.viewCount}
              </Typography>
            </Box>
          </Box>

          {isAuthor && (
            <Box>
              <IconButton size="small" onClick={() => navigate(`/community/edit/${post.id}`)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => setDeleteDialogOpen(true)}>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* 모집 정보 */}
        {post.isRecruitment && post.eventDate && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'primary.50' }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              모집 정보
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Event fontSize="small" />
                <Typography variant="body2">
                  {formatDate(post.eventDate)}
                </Typography>
              </Box>
              {post.eventLocation && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Place fontSize="small" />
                  <Typography variant="body2">{post.eventLocation}</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
          {post.content}
        </Typography>

        {/* 위치 정보 (Google Maps) */}
        {post.latitude && post.longitude && (
          <Box sx={{ mt: 3, mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Place color="primary" />
              위치 정보
            </Typography>
            {post.address && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {post.address}
              </Typography>
            )}
            <Box
              sx={{
                width: '100%',
                height: 300,
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${post.latitude},${post.longitude}&hl=ko&z=16&output=embed`}
                allowFullScreen
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* 추천/비추천 및 참여 버튼 */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant={myVote === 'LIKE' ? 'contained' : 'outlined'}
            startIcon={<ThumbUp />}
            onClick={() => handleVote('LIKE')}
          >
            추천 {post.likeCount}
          </Button>
          <Button
            variant={myVote === 'DISLIKE' ? 'contained' : 'outlined'}
            color="error"
            startIcon={<ThumbDown />}
            onClick={() => handleVote('DISLIKE')}
          >
            비추천 {post.dislikeCount}
          </Button>

          {post.isRecruitment && (
            <Button
              variant={participated ? 'outlined' : 'contained'}
              color="success"
              startIcon={<Group />}
              onClick={handleParticipate}
              disabled={!participated && (post.recruitmentCurrent || 0) >= (post.recruitmentMax || 0)}
            >
              {participated ? '참여 취소' : '참여하기'}
            </Button>
          )}
        </Box>
      </Paper>

      {/* 댓글 영역 */}
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          댓글 {post.commentCount}
        </Typography>

        {/* 댓글 작성 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!isAuthenticated}
          />
          <IconButton
            color="primary"
            onClick={handleSubmitComment}
            disabled={!isAuthenticated || !newComment.trim()}
          >
            <Send />
          </IconButton>
        </Box>

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 2 }}>
            댓글을 작성하려면 로그인이 필요합니다.
          </Alert>
        )}

        <Divider sx={{ mb: 2 }} />

        {/* 댓글 목록 */}
        {comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            첫 댓글을 작성해보세요!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24 }}>
                    {comment.userName ? comment.userName.charAt(0) : 'U'}
                  </Avatar>
                  <Typography variant="body2" fontWeight="bold">
                    {comment.userName || `사용자${comment.userId}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton size="small">
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    {comment.likeCount}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2">{comment.content}</Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>게시글 삭제</DialogTitle>
        <DialogContent>
          <Typography>정말로 이 게시글을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>

      {/* 목록으로 버튼 */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={() => navigate('/community')}>
          목록으로
        </Button>
      </Box>
    </Container>
  );
};

export default CommunityDetailPage;

