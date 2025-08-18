import axios from 'axios';
import { API_CONFIG } from '../constants';
import type {
  ApiResponse,
  User,
} from '../types';
import type {
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  ActivateAccountRequest,
} from '../types/auth';

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url as string | undefined;
    const publicAuthEndpoints = new Set<string>([
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      API_CONFIG.ENDPOINTS.AUTH.ACTIVATE,
    ]);
    const skipAuthRedirect = url ? publicAuthEndpoints.has(url) : false;

    if (status === 401 && !skipAuthRedirect) {
      // Token expired or invalid, force logout only for protected endpoints
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await authApi.post<{ token: string; userData: User }>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // 後端直接返回用戶數據，沒有 success 字段
    if (response.data.token && response.data.userData) {
      return {
        user: response.data.userData,
        token: response.data.token
      };
    }
    
    throw new Error('Invalid response format from server');
  },

  // Register user
  async register(credentials: RegisterCredentials): Promise<{ message: string }> {
    const response = await authApi.post<ApiResponse<{ message: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      { object: credentials }
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await authApi.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Logout error handled silently
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Request password reset
  async requestPasswordReset(request: ResetPasswordRequest): Promise<{ message: string }> {
    const response = await authApi.post<ApiResponse<{ message: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      request
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  // Confirm password reset
  async confirmPasswordReset(request: ResetPasswordConfirm): Promise<{ message: string }> {
    const response = await authApi.post<ApiResponse<{ message: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
      request
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  // Activate account
  async activateAccount(request: ActivateAccountRequest): Promise<{ message: string }> {
    const response = await authApi.post<ApiResponse<{ message: string }>>(
      API_CONFIG.ENDPOINTS.AUTH.ACTIVATE,
      request
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  // Get current user info
  async getCurrentUser(): Promise<User> {
    const response = await authApi.get<ApiResponse<User>>('/rest/user/info');
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  },

  // Validate token
  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await authApi.get<ApiResponse<{ valid: boolean }>>('/rest/user/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success && response.data.data.valid;
    } catch {
      return false;
    }
  },
};
