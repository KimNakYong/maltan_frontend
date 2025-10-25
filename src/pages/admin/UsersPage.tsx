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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  AdminPanelSettings,
  Close,
} from '@mui/icons-material';
import {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  AdminUser,
} from '../../services/adminService';
import { formatShortDate, formatDateTime } from '../../utils/dateUtils';

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(0); // 검색 시 첫 페이지로
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 사용자 목록 로드
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, debouncedSearch]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers(page, rowsPerPage, debouncedSearch || undefined);
      setUsers(response.users);
      setTotalUsers(response.totalItems);
    } catch (err: any) {
      console.error('사용자 목록 로드 실패:', err);
      setError('사용자 목록을 불러오는데 실패했습니다.');
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

  const handleViewUser = async (user: AdminUser) => {
    try {
      const fullUser = await getUser(user.id);
      setSelectedUser(fullUser);
      setDialogOpen(true);
    } catch (err) {
      alert('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };


  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      try {
        await deleteUser(userId);
        alert('사용자가 삭제되었습니다.');
        loadUsers();
      } catch (err) {
        alert('사용자 삭제에 실패했습니다.');
      }
    }
  };

  const handleToggleAdmin = async (userId: number, currentRole: 'USER' | 'ADMIN') => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (window.confirm(`이 사용자의 역할을 ${newRole}로 변경하시겠습니까?`)) {
      try {
        await updateUserRole(userId, newRole);
        alert(`역할이 ${newRole}로 변경되었습니다.`);
        loadUsers();
      } catch (err) {
        alert('역할 변경에 실패했습니다.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          사용자 관리
        </Typography>
        <Typography variant="body2" color="text.secondary">
          총 {totalUsers}명의 사용자
        </Typography>
      </Box>

      {/* 검색 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="이름 또는 이메일로 검색..."
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
          {/* 사용자 테이블 */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>사용자</TableCell>
                    <TableCell>이메일</TableCell>
                    <TableCell>권한</TableCell>
                    <TableCell>가입일</TableCell>
                    <TableCell align="center">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          사용자가 없습니다.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                              {user.name?.charAt(0) || user.username.charAt(0)}
                            </Avatar>
                            {user.name || user.username}
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role === 'ADMIN' ? '관리자' : '사용자'}
                            color={user.role === 'ADMIN' ? 'secondary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {formatShortDate(user.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewUser(user)}
                            title="상세 보기"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleToggleAdmin(user.id, user.role)}
                            title={user.role === 'ADMIN' ? '일반 사용자로 변경' : '관리자로 변경'}
                          >
                            <AdminPanelSettings />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
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
              count={totalUsers}
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

      {/* 사용자 상세 정보 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">사용자 상세 정보</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, margin: '0 auto', mb: 2 }}>
                  {selectedUser.name?.charAt(0) || selectedUser.username.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  ID
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUser.id}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  이름
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUser.name || selectedUser.username}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  이메일
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUser.email}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  전화번호
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">{selectedUser.phoneNumber || '-'}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  권한
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Chip
                  label={selectedUser.role === 'ADMIN' ? '관리자' : '사용자'}
                  color={selectedUser.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  선호 지역
                </Typography>
              </Grid>
              <Grid item xs={8}>
                {selectedUser.preferredRegions && selectedUser.preferredRegions.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedUser.preferredRegions.map((region: any, index: number) => (
                      <Chip
                        key={index}
                        label={`${region.cityName} ${region.districtName}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  가입일
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {formatDateTime(selectedUser.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">
                  수정일
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <Typography variant="body1">
                  {formatDateTime(selectedUser.updatedAt)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
