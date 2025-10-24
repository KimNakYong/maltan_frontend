import React, { useState } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Search,
  Edit,
  Delete,
  Block,
  CheckCircle,
  AdminPanelSettings,
} from '@mui/icons-material';

// Mock 데이터
const mockUsers = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `사용자${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 10 === 0 ? 'ADMIN' : 'USER',
  status: i % 15 === 0 ? 'blocked' : 'active',
  preferredRegions: ['서울특별시 강남구', '서울특별시 마포구'],
  createdAt: new Date(2024, 0, i + 1).toISOString(),
  lastLoginAt: new Date(2024, 9, 20 - (i % 20)).toISOString(),
}));

const UsersPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleBlockUser = (userId: string) => {
    console.log('Block user:', userId);
    // 실제로는 API 호출
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까?')) {
      console.log('Delete user:', userId);
      // 실제로는 API 호출
    }
  };

  const handleToggleAdmin = (userId: string) => {
    console.log('Toggle admin:', userId);
    // 실제로는 API 호출
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          사용자 관리
        </Typography>
        <Button variant="contained" color="primary">
          사용자 추가
        </Button>
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

      {/* 사용자 테이블 */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>사용자</TableCell>
                <TableCell>이메일</TableCell>
                <TableCell>권한</TableCell>
                <TableCell>상태</TableCell>
                <TableCell>가입일</TableCell>
                <TableCell>마지막 로그인</TableCell>
                <TableCell align="center">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                          {user.username.charAt(0)}
                        </Avatar>
                        {user.username}
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
                      <Chip
                        label={user.status === 'active' ? '활성' : '차단'}
                        color={user.status === 'active' ? 'success' : 'error'}
                        size="small"
                        icon={user.status === 'active' ? <CheckCircle /> : <Block />}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastLoginAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewUser(user)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleToggleAdmin(user.id)}
                      >
                        <AdminPanelSettings />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleBlockUser(user.id)}
                      >
                        <Block />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
        />
      </Paper>

      {/* 사용자 상세 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>사용자 상세 정보</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  {selectedUser.username.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  이름
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedUser.username}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  이메일
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedUser.email}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  권한
                </Typography>
                <Chip
                  label={selectedUser.role === 'ADMIN' ? '관리자' : '사용자'}
                  color={selectedUser.role === 'ADMIN' ? 'secondary' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  상태
                </Typography>
                <Chip
                  label={selectedUser.status === 'active' ? '활성' : '차단'}
                  color={selectedUser.status === 'active' ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  관심 지역
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {selectedUser.preferredRegions.map((region: string, index: number) => (
                    <Chip key={index} label={`${index + 1}순위: ${region}`} size="small" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  가입일
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedUser.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  마지막 로그인
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedUser.lastLoginAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>닫기</Button>
          <Button variant="contained" color="primary">
            수정
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;

