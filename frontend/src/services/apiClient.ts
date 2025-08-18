import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ENV_CONFIG } from '../config/env';

// API響應接口
export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data: T;
}

// API錯誤接口
export interface ApiError {
  success?: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// 請求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  retry?: boolean;
}

// 響應數據包裝器
export class ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  data: T;
  status: number;

  constructor(success: boolean, message: string, data: T, status: number) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.status = status;
  }

  static fromAxiosResponse<T>(response: AxiosResponse<T>): ApiResponseWrapper<T> {
    return new ApiResponseWrapper(
      true,
      'Success',
      response.data,
      response.status
    );
  }

  static fromError<T>(error: AxiosError): ApiResponseWrapper<T> {
    const message = (error.response?.data as { message?: string })?.message || error.message || 'Unknown error occurred';
    return new ApiResponseWrapper(
      false,
      message,
      null as T,
      error.response?.status || 500
    );
  }
}

// 創建基礎API客戶端
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: ENV_CONFIG.API_BASE_URL,
      timeout: ENV_CONFIG.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 設置攔截器
  private setupInterceptors(): void {
    // 請求攔截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加認證token
        if (!(config as RequestConfig & { skipAuth?: boolean }).skipAuth) {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 添加請求ID用於追蹤
        config.headers['X-Request-ID'] = this.generateRequestId();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 響應攔截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 成功響應處理
        return response;
      },
      async (error: AxiosError) => {
        // 錯誤響應處理
        return this.handleResponseError(error);
      }
    );
  }

  // 處理響應錯誤
  private async handleResponseError(error: AxiosError): Promise<never> {
    const status = error.response?.status;
    const config = error.config as RequestConfig;

    // 處理401未授權錯誤
    if (status === 401 && !config?.skipAuth) {
      this.handleUnauthorizedError();
    }

    // 處理403禁止訪問錯誤
    if (status === 403) {
      this.handleForbiddenError();
    }

    // 處理500服務器錯誤
    if (status && status >= 500) {
      this.handleServerError(error);
    }

    // 處理網絡錯誤
    if (!error.response) {
      this.handleNetworkError(error);
    }

    return Promise.reject(error);
  }

  // 處理未授權錯誤
  private handleUnauthorizedError(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    // 重定向到登錄頁面
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // 處理禁止訪問錯誤
  private handleForbiddenError(): void {
    console.error('Access forbidden: User does not have required permissions');
    // 可以在這裡顯示權限不足的提示
  }

  // 處理服務器錯誤
  private handleServerError(error: AxiosError): void {
    console.error('Server error:', error.response?.data);
    // 可以在這裡顯示服務器錯誤的提示
  }

  // 處理網絡錯誤
  private handleNetworkError(error: AxiosError): void {
    console.error('Network error:', error.message);
    // 可以在這裡顯示網絡錯誤的提示
  }

  // 生成請求ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 通用GET請求
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponseWrapper<T>> {
    try {
      const response = await this.client.get<T>(url, config);
      return ApiResponseWrapper.fromAxiosResponse(response);
    } catch (error) {
      return ApiResponseWrapper.fromError(error as AxiosError);
    }
  }

  // 通用POST請求
  async post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponseWrapper<T>> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return ApiResponseWrapper.fromAxiosResponse(response);
    } catch (error) {
      return ApiResponseWrapper.fromError(error as AxiosError);
    }
  }

  // 通用PUT請求
  async put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponseWrapper<T>> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return ApiResponseWrapper.fromAxiosResponse(response);
    } catch (error) {
      return ApiResponseWrapper.fromError(error as AxiosError);
    }
  }

  // 通用DELETE請求
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponseWrapper<T>> {
    try {
      const response = await this.client.delete<T>(url, config);
      return ApiResponseWrapper.fromAxiosResponse(response);
    } catch (error) {
      return ApiResponseWrapper.fromError(error as AxiosError);
    }
  }

  // 文件上傳請求
  async upload<T>(url: string, file: File, config?: RequestConfig): Promise<ApiResponseWrapper<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadConfig: RequestConfig = {
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await this.client.post<T>(url, formData, uploadConfig);
      return ApiResponseWrapper.fromAxiosResponse(response);
    } catch (error) {
      return ApiResponseWrapper.fromError(error as AxiosError);
    }
  }

  // 批量請求
  async batch<T>(requests: Array<() => Promise<ApiResponseWrapper<T>>>): Promise<ApiResponseWrapper<T>[]> {
    try {
      const responses = await Promise.all(requests.map(request => request()));
      return responses;
    } catch (error) {
      console.error('Batch request failed:', error);
      return [];
    }
  }

  // 設置認證token
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // 清除認證token
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  // 獲取認證token
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // 檢查是否已認證
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// 創建單例實例
export const apiClient = new ApiClient();

// 導出類型
export type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError };
