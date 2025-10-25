import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container, Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
// import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleAdmin = () => {
    handleClose();
    navigate('/admin');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 0, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            우리동네
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
            <Button color="inherit" onClick={() => navigate('/')}>
              홈
            </Button>
            <Button color="inherit" onClick={() => navigate('/map-test')}>
              지도 테스트
            </Button>
            <Button color="inherit" onClick={() => navigate('/community')}>
              커뮤니티
            </Button>
          </Box>

          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {user?.username}님
              </Typography>
              <IconButton onClick={handleMenu} color="inherit" size="small">
                {user?.profileImage ? (
                  <Avatar src={user.profileImage} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfile}>프로필</MenuItem>
                {user?.role === 'ADMIN' && (
                  <>
                    <Divider />
                    <MenuItem onClick={handleAdmin}>
                      <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 20 }} />
                      관리자 페이지
                    </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>
                로그인
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                회원가입
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, py: 3, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.grey[200],
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 우리동네 소개 서비스. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;

