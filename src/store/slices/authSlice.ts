import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService, { LoginRequest, RegisterRequest, User } from '../../services/authService';
import { STORAGE_KEYS } from '../../utils/constants';
import { getLocalStorage } from '../../utils/helpers';
import toast from 'react-hot-toast';

// State 타입
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: AuthState = {
  user: getLocalStorage<User>(STORAGE_KEYS.USER),
  isAuthenticated: !!getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN),
  loading: false,
  error: null,
};

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      toast.success('로그인에 성공했습니다.');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || '로그인에 실패했습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      toast.success('회원가입에 성공했습니다.');
      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || '회원가입에 실패했습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      toast.success('로그아웃되었습니다.');
    } catch (error: any) {
      const message = error.response?.data?.message || '로그아웃에 실패했습니다.';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      const message = error.response?.data?.message || '사용자 정보를 불러올 수 없습니다.';
      return rejectWithValue(message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Get Current User
    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { setUser, clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;

