import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getProfile, updateProfile, changePassword } from '../store/slices/userSlice';
import { VALIDATION } from '../utils/constants';
import { UpdateProfileRequest, ChangePasswordRequest } from '../services/userService';
import EditIcon from '@mui/icons-material/Edit';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading, error } = useAppSelector((state) => state.user);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<UpdateProfileRequest>();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordRequest>();

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      resetProfile({
        username: profile.username,
        address: profile.address,
        phone: profile.phone || '',
      });
    }
  }, [profile, resetProfile]);

  const onSubmitProfile = async (data: UpdateProfileRequest) => {
    await dispatch(updateProfile(data));
  };

  const onSubmitPassword = async (data: ChangePasswordRequest) => {
    await dispatch(changePassword(data));
    setPasswordDialogOpen(false);
    resetPassword();
  };

  if (loading && !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        프로필 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* 프로필 정보 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={profile?.profileImage}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {profile?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {profile?.email}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              size="small"
              sx={{ mt: 2 }}
            >
              사진 변경
            </Button>
          </Paper>
        </Grid>

        {/* 프로필 수정 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이메일"
                    value={profile?.email}
                    disabled
                    helperText="이메일은 변경할 수 없습니다"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이름"
                    {...registerProfile('username', {
                      required: '이름을 입력해주세요',
                      minLength: {
                        value: VALIDATION.USERNAME_MIN_LENGTH,
                        message: `이름은 최소 ${VALIDATION.USERNAME_MIN_LENGTH}자 이상이어야 합니다`,
                      },
                    })}
                    error={!!profileErrors.username}
                    helperText={profileErrors.username?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="주소"
                    {...registerProfile('address', {
                      required: '주소를 입력해주세요',
                    })}
                    error={!!profileErrors.address}
                    helperText={profileErrors.address?.message}
                    disabled={loading}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="전화번호"
                    {...registerProfile('phone', {
                      pattern: {
                        value: VALIDATION.PHONE_REGEX,
                        message: '올바른 전화번호 형식이 아닙니다',
                      },
                    })}
                    error={!!profileErrors.phone}
                    helperText={profileErrors.phone?.message}
                    disabled={loading}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : '저장'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  비밀번호 변경
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <DialogTitle>비밀번호 변경</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="현재 비밀번호"
              type="password"
              margin="normal"
              {...registerPassword('currentPassword', {
                required: '현재 비밀번호를 입력해주세요',
              })}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword?.message}
            />
            <TextField
              fullWidth
              label="새 비밀번호"
              type="password"
              margin="normal"
              {...registerPassword('newPassword', {
                required: '새 비밀번호를 입력해주세요',
                minLength: {
                  value: VALIDATION.PASSWORD_MIN_LENGTH,
                  message: `비밀번호는 최소 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`,
                },
              })}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialogOpen(false)}>취소</Button>
            <Button type="submit" variant="contained">
              변경
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;

