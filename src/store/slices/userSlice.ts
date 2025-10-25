import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService, { UpdateProfileRequest, ChangePasswordRequest } from '../../services/userService';
import { User } from '../../services/authService';
import { STORAGE_KEYS } from '../../utils/constants';
import { setLocalStorage } from '../../utils/helpers';
import toast from 'react-hot-toast';

// State 타입
interface UserState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

// Async Thunks
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await userService.getProfile();
      return profile;
    } catch (error: any) {
      const message = error.response?.data?.message || '프로필을 불러올 수 없습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const profile = await userService.updateProfile(data);
      toast.success('프로필이 업데이트되었습니다.');
      return profile;
    } catch (error: any) {
      const message = error.response?.data?.message || '프로필 업데이트에 실패했습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      await userService.changePassword(data);
      toast.success('비밀번호가 변경되었습니다.');
    } catch (error: any) {
      const message = error.response?.data?.message || '비밀번호 변경에 실패했습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const imageUrl = await userService.uploadProfileImage(file);
      toast.success('프로필 이미지가 업로드되었습니다.');
      return imageUrl;
    } catch (error: any) {
      const message = error.response?.data?.message || '이미지 업로드에 실패했습니다.';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get Profile
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      // 로컬 스토리지도 업데이트
      setLocalStorage(STORAGE_KEYS.USER, action.payload);
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Upload Profile Image
    builder.addCase(uploadProfileImage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(uploadProfileImage.fulfilled, (state, action) => {
      state.loading = false;
      if (state.profile) {
        state.profile.profileImage = action.payload;
      }
    });
    builder.addCase(uploadProfileImage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;

