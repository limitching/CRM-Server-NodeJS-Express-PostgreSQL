import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';
import { authService } from '../../services/authService';
import type { LoginCredentials, RegisterCredentials, ResetPasswordRequest, ResetPasswordConfirm, ActivateAccountRequest } from '../../types/auth';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(credentials);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (request: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(request);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const confirmResetPassword = createAsyncThunk(
  'auth/confirmResetPassword',
  async (request: ResetPasswordConfirm, { rejectWithValue }) => {
    try {
      const response = await authService.confirmPasswordReset(request);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset confirmation failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const activateAccount = createAsyncThunk(
  'auth/activateAccount',
  async (request: ActivateAccountRequest, { rejectWithValue }) => {
    try {
      const response = await authService.activateAccount(request);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Account activation failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (_userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser(); // For now, just return current user
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// State interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
  resetPasswordLoading: boolean;
  activateAccountLoading: boolean;
  profileUpdateLoading: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  rememberMe: false,
  loginLoading: false,
  registerLoading: false,
  resetPasswordLoading: false,
  activateAccountLoading: false,
  profileUpdateLoading: false,
};

// Create slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
    updateUserAvatar: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.error = action.payload as string;
      });

    // Confirm Reset Password
    builder
      .addCase(confirmResetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.error = null;
      })
      .addCase(confirmResetPassword.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.error = null;
      })
      .addCase(confirmResetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.error = action.payload as string;
      });

    // Activate Account
    builder
      .addCase(activateAccount.pending, (state) => {
        state.activateAccountLoading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state) => {
        state.activateAccountLoading = false;
        state.error = null;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.activateAccountLoading = false;
        state.error = action.payload as string;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.profileUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileUpdateLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileUpdateLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  setLoading,
  setUser,
  setToken,
  setRememberMe,
  updateUserAvatar,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
