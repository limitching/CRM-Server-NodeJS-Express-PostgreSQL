import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type {
  AuthState,
  AuthContextType,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  ResetPasswordConfirm,
  ActivateAccountRequest,
} from '../types/auth';
import type { User } from '../types';
import { STORAGE_KEYS } from '../constants';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  rememberMe: false,
};

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; rememberMe: boolean } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        rememberMe: action.payload.rememberMe,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        try {
          // Validate token
          const isValid = await authService.validateToken(token);
          if (isValid) {
            const user = JSON.parse(userData);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, token, rememberMe: true },
            });
          } else {
            // Invalid token, clear storage
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      }
      
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  // Save to localStorage when auth state changes
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, state.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
    }
  }, [state.token, state.user]);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const { user, token } = await authService.login(credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token, rememberMe: credentials.rememberMe || false },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.register(credentials);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.requestPasswordReset(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset request failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const resetPasswordConfirm = async (request: ResetPasswordConfirm) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.confirmPasswordReset(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset confirmation failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const activateAccount = async (request: ActivateAccountRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      await authService.activateAccount(request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Account activation failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    register,
    resetPassword,
    resetPasswordConfirm,
    activateAccount,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
