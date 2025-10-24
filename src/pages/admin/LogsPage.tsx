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
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import { Search } from '@mui/icons-material';

// Mock 데이터
const mockLogs = Array.from({ length: 100 }, (_, i) => ({
  id: `log-${i + 1}`,
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  level: ['INFO', 'WARNING', 'ERROR', 'DEBUG'][i % 4],
  service: ['User', 'Place', 'Community', 'Recommendation', 'Gateway'][i % 5],
  message: [
    'User login successful',
    'Database connection timeout',
    'API request processed',
    'Cache miss for key: places:123',
    'Rate limit exceeded for IP: 192.168.1.1',
  ][i % 5],
  userId: i % 3 === 0 ? `user-${i}` : null,
}));

const LogsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    return matchesSearch && matchesLevel && matchesService;
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'error';
      case 'WARNING':
        return 'warning';
      case 'INFO':
        return 'info';
      case 'DEBUG':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        시스템 로그
      </Typography>

      {/* 필터 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="로그 메시지 또는 서비스 검색..."
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
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>로그 레벨</InputLabel>
              <Select
                value={levelFilter}
                label="로그 레벨"
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="ERROR">ERROR</MenuItem>
                <MenuItem value="WARNING">WARNING</MenuItem>
                <MenuItem value="INFO">INFO</MenuItem>
                <MenuItem value="DEBUG">DEBUG</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>서비스</InputLabel>
              <Select
                value={serviceFilter}
                label="서비스"
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <MenuItem value="all">전체</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Place">Place</MenuItem>
                <MenuItem value="Community">Community</MenuItem>
                <MenuItem value="Recommendation">Recommendation</MenuItem>
                <MenuItem value="Gateway">Gateway</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 로그 테이블 */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>시간</TableCell>
                <TableCell>레벨</TableCell>
                <TableCell>서비스</TableCell>
                <TableCell>메시지</TableCell>
                <TableCell>사용자 ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.level}
                        color={getLevelColor(log.level) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={log.service} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.userId || '-'}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredLogs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
        />
      </Paper>
    </Box>
  );
};

export default LogsPage;

