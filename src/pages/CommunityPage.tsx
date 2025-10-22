import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CommunityPage: React.FC = () => {
  return (
    <Box>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          커뮤니티 페이지
        </Typography>
        <Typography variant="body1" color="text.secondary">
          커뮤니티 서비스 개발 후 구현 예정
        </Typography>
      </Paper>
    </Box>
  );
};

export default CommunityPage;

