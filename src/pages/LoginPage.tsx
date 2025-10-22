import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/slices/authSlice';
import { VALIDATION } from '../utils/constants';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    // 이미 로그인된 경우 홈으로 이동
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // 컴포넌트 언마운트 시 에러 초기화
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(login(data));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          로그인
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          우리동네 소개 서비스에 오신 것을 환영합니다
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="이메일"
            type="email"
            margin="normal"
            {...register('email', {
              required: '이메일을 입력해주세요',
              pattern: {
                value: VALIDATION.EMAIL_REGEX,
                message: '올바른 이메일 형식이 아닙니다',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            margin="normal"
            {...register('password', {
              required: '비밀번호를 입력해주세요',
              minLength: {
                value: VALIDATION.PASSWORD_MIN_LENGTH,
                message: `비밀번호는 최소 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`,
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '로그인'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              계정이 없으신가요?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/register')}
                sx={{ cursor: 'pointer' }}
              >
                회원가입
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;

