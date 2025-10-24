import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        시스템 설정
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          시스템 설정 페이지 (개발 예정)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          시스템 환경 설정, 알림 설정, 백업 관리 등의 기능이 제공됩니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SettingsPage;

