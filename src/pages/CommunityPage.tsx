import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  ThumbUp,
  Comment as CommentIcon,
  Place,
  Event,
  Group,
  Add,
  Visibility,
  Whatshot,
} from '@mui/icons-material';
import { getPosts, Post, PostListParams } from '../services/communityService';
import { useAppSelector } from '../store/hooks';
import { formatRelativeDate } from '../utils/dateUtils';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ['전체', '자유', '질문', '정보', '모임', '봉사', '운동', '취미'];

  // 게시글 목록 가져오기
  useEffect(() => {
    fetchPosts();
  }, [selectedTab, selectedCategory, searchKeyword, page]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PostListParams = {
        page,
        size: 10,
        sort: 'createdAt,desc',
      };

      if (selectedTab === 1) {
        params.isRecruitment = true;
      }

      if (selectedCategory !== '전체') {
        params.category = selectedCategory;
      }

      if (searchKeyword && searchKeyword.trim() !== '') {
        params.search = searchKeyword.trim();
      }

      const response = await getPosts(params);
      setPosts(response.content);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      console.error('게시글 목록 조회 실패:', err);
      setError(err.response?.data?.message || '게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWritePost = () => {
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    navigate('/community/write');
  };

  const handlePostClick = (postId: number) => {
    navigate(`/community/${postId}`);
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          커뮤니티
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          sx={{ borderRadius: 2 }}
          onClick={handleWritePost}
        >
          글쓰기
        </Button>
      </Box>

      {/* 탭 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="전체" />
          <Tab label="모집" />
        </Tabs>
      </Box>

      {/* 필터 */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>카테고리</InputLabel>
          <Select
            value={selectedCategory}
            label="카테고리"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          size="small"
          placeholder="검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 로딩 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !posts || posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            게시글이 없습니다.
          </Typography>
        </Box>
      ) : (
        <>
          {/* 게시글 목록 */}
          <Grid container spacing={2}>
            {posts && posts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card
              onClick={() => handlePostClick(post.id)}
              sx={{
                '&:hover': {
                  boxShadow: 4,
                  cursor: 'pointer',
                },
                transition: 'box-shadow 0.3s',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  {post.isPinned && post.pinnedUntil && new Date(post.pinnedUntil) > new Date() && (
                    <Chip
                      label="인기"
                      size="small"
                      color="error"
                      icon={<Whatshot />}
                      sx={{
                        fontWeight: 'bold',
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 1 },
                          '50%': { opacity: 0.7 },
                        },
                      }}
                    />
                  )}
                  <Chip
                    label={post.category}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {post.isRecruitment && (
                    <Chip
                      label={`모집 중 ${post.recruitmentCurrent}/${post.recruitmentMax}`}
                      size="small"
                      color="success"
                      icon={<Group />}
                    />
                  )}
                  <Chip
                    label={`${post.regionGu || post.regionSi}`}
                    size="small"
                    icon={<Place />}
                  />
                </Box>

                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {post.content}
                </Typography>

                {post.isRecruitment && post.eventDate && (
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Event fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.eventDate).toLocaleDateString('ko-KR', {
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    </Box>
                    {post.eventLocation && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Place fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {post.eventLocation}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      {post.userName ? post.userName.charAt(0) : 'U'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {post.userName || `사용자${post.userId}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRelativeDate(post.createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ThumbUp fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.likeCount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CommentIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.commentCount}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Visibility fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {post.viewCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
        </>
      )}
    </Container>
  );
};

export default CommunityPage;
