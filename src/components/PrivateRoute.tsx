import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { Box, Typography, Paper } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 관리자 권한 체크
  if (requireAdmin && user?.role !== 'ADMIN') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            접근 권한 없음
          </Typography>
          <Typography variant="body1" color="text.secondary">
            관리자 권한이 필요한 페이지입니다.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;

