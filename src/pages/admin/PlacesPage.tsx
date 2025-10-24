import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const PlacesPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        장소 관리
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          장소 관리 페이지 (개발 예정)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          등록된 장소 목록, 승인 대기 장소, 장소 정보 수정 등의 기능이 제공됩니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PlacesPage;

