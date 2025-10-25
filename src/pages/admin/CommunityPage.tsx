import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  Visibility,
  Delete,
  Whatshot,
} from '@mui/icons-material';
import { getPosts, Post } from '../../services/communityService';
import { deleteCommunityPost } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // 게시글 목록 로드
  useEffect(() => {
    loadPosts();
  }, [page, rowsPerPage]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPosts({
        page,
        size: rowsPerPage,
        sort: 'createdAt,desc',
      });
      setPosts(response.content);
      setTotalPosts(response.totalElements);
    } catch (err: any) {
      console.error('게시글 목록 로드 실패:', err);
      setError('게시글 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewPost = (postId: number) => {
    navigate(`/community/${postId}`);
  };

  const handleDeleteClick = (post: Post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPost) return;

    try {
      await deleteCommunityPost(selectedPost.id);
      alert('게시글이 삭제되었습니다.');
      setDeleteDialogOpen(false);
      setSelectedPost(null);
      loadPosts();
    } catch (err) {
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPost(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          커뮤니티 관리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          총 {totalPosts}개의 게시글
        </Typography>
      </Box>

      {/* 검색 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="제목, 내용, 작성자로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

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
      ) : (
        <>
          {/* 게시글 테이블 */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width="50">ID</TableCell>
                    <TableCell>제목</TableCell>
                    <TableCell width="100">카테고리</TableCell>
                    <TableCell width="120">작성자</TableCell>
                    <TableCell width="100">지역</TableCell>
                    <TableCell width="80" align="center">조회</TableCell>
                    <TableCell width="80" align="center">추천</TableCell>
                    <TableCell width="80" align="center">댓글</TableCell>
                    <TableCell width="120">작성일</TableCell>
                    <TableCell width="120" align="center">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          게시글이 없습니다.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id} hover>
                        <TableCell>{post.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {post.isPinned && post.pinnedUntil && new Date(post.pinnedUntil) > new Date() && (
                              <Whatshot color="error" fontSize="small" />
                            )}
                            <Typography
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 300,
                              }}
                            >
                              {post.title}
                            </Typography>
                            {post.isRecruitment && (
                              <Chip label="모집" size="small" color="success" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={post.category} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>{post.userName || `사용자${post.userId}`}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontSize="0.75rem">
                            {post.regionGu || post.regionSi}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{post.viewCount}</TableCell>
                        <TableCell align="center">{post.likeCount}</TableCell>
                        <TableCell align="center">{post.commentCount}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontSize="0.75rem">
                            {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewPost(post.id)}
                            title="보기"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(post)}
                            title="삭제"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalPosts}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="페이지당 행 수:"
            />
          </Paper>
        </>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>게시글 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            정말 이 게시글을 삭제하시겠습니까?
          </Typography>
          {selectedPost && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {selectedPost.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                작성자: {selectedPost.userName || `사용자${selectedPost.userId}`}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>취소</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunityPage;
