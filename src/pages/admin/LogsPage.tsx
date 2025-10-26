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
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
} from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';
import { getSystemLogs, SystemLog } from '../../services/monitoringService';
import { formatDateTime } from '../../utils/dateUtils';

const LogsPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSystemLogs(100, serviceFilter, levelFilter);
      setLogs(data);
    } catch (err: any) {
      console.error('로그 로드 실패:', err);
      setError('로그를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [levelFilter, serviceFilter]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
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

  if (loading && logs.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          시스템 로그
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadLogs}
          disabled={loading}
        >
          새로고침
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
                <TableCell sx={{ width: '180px' }}>시간</TableCell>
                <TableCell sx={{ width: '100px' }}>레벨</TableCell>
                <TableCell sx={{ width: '120px' }}>서비스</TableCell>
                <TableCell>메시지</TableCell>
                <TableCell sx={{ width: '100px' }}>사용자 ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {formatDateTime(log.timestamp)}
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
                    <TableCell>
                      <Tooltip title={log.message} arrow placement="top">
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: '600px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // 최대 2줄까지 표시
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word', // 긴 단어는 줄바꿈
                            cursor: 'help',
                          }}
                        >
                          {log.message}
                        </Typography>
                      </Tooltip>
                    </TableCell>
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

