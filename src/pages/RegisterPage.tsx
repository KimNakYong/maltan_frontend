import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register as registerAction, clearError } from '../store/slices/authSlice';
import { VALIDATION } from '../utils/constants';
import RegionSelector from '../components/RegionSelector';
import { SelectedRegion } from '../utils/regionData';

interface RegisterFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedRegions, setSelectedRegions] = useState<SelectedRegion[]>([]);
  const [regionError, setRegionError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

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

  const onSubmit = async (data: RegisterFormData) => {
    // 지역 선택 검증
    if (selectedRegions.length === 0) {
      setRegionError('최소 1개 이상의 지역을 선택해주세요.');
      return;
    }

    setRegionError('');

    // 선택된 지역 정보를 포함하여 회원가입
    const { passwordConfirm, ...registerData } = data;
    const registerDataWithRegions = {
      ...registerData,
      preferredRegions: selectedRegions.map((region) => ({
        city: region.city,
        cityName: region.cityName,
        district: region.district,
        districtName: region.districtName,
        priority: region.priority,
      })),
    };

    await dispatch(registerAction(registerDataWithRegions));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        py: 4,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          회원가입
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
          우리동네의 다양한 정보를 확인하세요
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이메일"
                type="email"
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                {...register('password', {
                  required: '비밀번호를 입력해주세요',
                  minLength: {
                    value: VALIDATION.PASSWORD_MIN_LENGTH,
                    message: `비밀번호는 최소 ${VALIDATION.PASSWORD_MIN_LENGTH}자 이상이어야 합니다`,
                  },
                  maxLength: {
                    value: VALIDATION.PASSWORD_MAX_LENGTH,
                    message: `비밀번호는 최대 ${VALIDATION.PASSWORD_MAX_LENGTH}자까지 입력 가능합니다`,
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="비밀번호 확인"
                type="password"
                {...register('passwordConfirm', {
                  required: '비밀번호를 다시 입력해주세요',
                  validate: (value) =>
                    value === password || '비밀번호가 일치하지 않습니다',
                })}
                error={!!errors.passwordConfirm}
                helperText={errors.passwordConfirm?.message}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                {...register('username', {
                  required: '이름을 입력해주세요',
                  minLength: {
                    value: VALIDATION.USERNAME_MIN_LENGTH,
                    message: `이름은 최소 ${VALIDATION.USERNAME_MIN_LENGTH}자 이상이어야 합니다`,
                  },
                  maxLength: {
                    value: VALIDATION.USERNAME_MAX_LENGTH,
                    message: `이름은 최대 ${VALIDATION.USERNAME_MAX_LENGTH}자까지 입력 가능합니다`,
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <RegionSelector
                selectedRegions={selectedRegions}
                onChange={setSelectedRegions}
                error={regionError}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="전화번호"
                placeholder="예: 010-1234-5678"
                {...register('phone', {
                  pattern: {
                    value: VALIDATION.PHONE_REGEX,
                    message: '올바른 전화번호 형식이 아닙니다',
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message || '선택사항입니다'}
                disabled={loading}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '회원가입'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              이미 계정이 있으신가요?{' '}
              <Link
                component="button"
                type="button"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                로그인
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default RegisterPage;

