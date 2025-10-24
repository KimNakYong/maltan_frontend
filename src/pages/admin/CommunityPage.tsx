import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CommunityPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        커뮤니티 관리
      </Typography>
      <Paper sx={{ p: 3, textAlign: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">
          커뮤니티 관리 페이지 (개발 예정)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          게시글 관리, 댓글 관리, 신고 처리 등의 기능이 제공됩니다.
        </Typography>
      </Paper>
    </Box>
  );
};

export default CommunityPage;

