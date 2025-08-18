import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { User, UserCreateRequest, UserUpdateRequest } from '../types';

// 用戶查詢參數接口
export interface UserQueryParams {
  search?: string;
  active?: boolean;
  role_id?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 用戶過濾器接口
export interface UserFilters {
  active?: boolean[];
  role_id?: number[];
  createdDate?: {
    from: string;
    to: string;
  };
  updatedDate?: {
    from: string;
    to: string;
  };
}

// 用戶統計接口
export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  by_role: Record<string, number>;
  by_month: Record<string, number>;
}

// 用戶服務類
export class UserService {
  // 獲取所有用戶（管理員專用）
  static async getAll(params?: UserQueryParams): Promise<User[]> {
    try {
      const response = await apiClient.post<User[]>(
        API_CONFIG.ENDPOINTS.USERS.ALL,
        { object: params || {} }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  // 根據ID獲取用戶
  static async getById(id: number): Promise<User> {
    try {
      const users = await this.getAll();
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      return user;
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  // 創建新用戶（管理員專用）
  static async create(userData: UserCreateRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        API_CONFIG.ENDPOINTS.USERS.SAVE,
        { object: userData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  // 更新用戶（管理員專用）
  static async update(id: number, userData: UserUpdateRequest): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        API_CONFIG.ENDPOINTS.USERS.SAVE,
        { object: { ...userData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  // 更新當前用戶信息
  static async updateCurrentUser(userData: Partial<UserUpdateRequest>): Promise<User> {
    try {
      const response = await apiClient.post<User>(
        API_CONFIG.ENDPOINTS.USERS.UPDATE,
        { object: userData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to update current user:', error);
      throw error;
    }
  }

  // 刪除用戶（管理員專用）
  static async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.post<void>(
        API_CONFIG.ENDPOINTS.USERS.REMOVE,
        { object: { id } }
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除用戶
  static async deleteMultiple(ids: number[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.delete(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete multiple users:', error);
      throw error;
    }
  }

  // 上傳用戶頭像
  static async uploadAvatar(file: File): Promise<{ url: string }> {
    try {
      // 將文件轉換為base64
      const base64 = await this.fileToBase64(file);
      
      const response = await apiClient.post<{ url: string }>(
        API_CONFIG.ENDPOINTS.USERS.AVATAR,
        { base64 }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      throw error;
    }
  }

  // 搜索用戶
  static async search(query: string, filters?: UserFilters): Promise<User[]> {
    try {
      const allUsers = await this.getAll();
      
      const filteredUsers = allUsers.filter(user => {
        // 文本搜索
        const searchMatch = query
          ? user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.email.toLowerCase().includes(query.toLowerCase())
          : true;

        if (!searchMatch) return false;

        // 活躍狀態過濾
        if (filters?.active && filters.active.length > 0) {
          if (!filters.active.includes(user.active)) {
            return false;
          }
        }

        // 角色過濾
        if (filters?.role_id && filters.role_id.length > 0) {
          const userRoleIds = user.roles.map(role => role.id);
          const hasMatchingRole = filters.role_id.some(roleId => 
            userRoleIds.includes(roleId)
          );
          if (!hasMatchingRole) {
            return false;
          }
        }

        // 創建日期過濾
        if (filters?.createdDate) {
          const createdDate = new Date(user.created_at || new Date());
          const fromDate = new Date(filters.createdDate.from);
          const toDate = new Date(filters.createdDate.to);
          
          if (createdDate < fromDate || createdDate > toDate) {
            return false;
          }
        }

        // 更新日期過濾
        if (filters?.updatedDate) {
          const updatedDate = new Date(user.updated_at || new Date());
          const fromDate = new Date(filters.updatedDate.from);
          const toDate = new Date(filters.updatedDate.to);
          
          if (updatedDate < fromDate || updatedDate > toDate) {
            return false;
          }
        }

        return true;
      });

      return filteredUsers;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  }

  // 獲取用戶統計
  static async getStats(): Promise<UserStats> {
    try {
      const users = await this.getAll();
      
      const stats: UserStats = {
        total: users.length,
        active: 0,
        inactive: 0,
        by_role: {},
        by_month: {},
      };

      users.forEach(user => {
        // 活躍狀態統計
        if (user.active) {
          stats.active++;
        } else {
          stats.inactive++;
        }

        // 按角色統計
        user.roles.forEach(role => {
          const roleName = role.name;
          stats.by_role[roleName] = (stats.by_role[roleName] || 0) + 1;
        });

        // 按月份統計（使用創建日期或當前日期）
        const date = user.created_at ? new Date(user.created_at) : new Date();
        const month = date.toISOString().slice(0, 7); // YYYY-MM
        stats.by_month[month] = (stats.by_month[month] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get user stats:', error);
      throw error;
    }
  }

  // 根據角色獲取用戶
  static async getByRole(roleId: number): Promise<User[]> {
    try {
      const users = await this.getAll();
      return users.filter(user => 
        user.roles.some(role => role.id === roleId)
      );
    } catch (error) {
      console.error(`Failed to get users by role ${roleId}:`, error);
      throw error;
    }
  }

  // 獲取活躍用戶
  static async getActive(): Promise<User[]> {
    try {
      const users = await this.getAll();
      return users.filter(user => user.active);
    } catch (error) {
      console.error('Failed to get active users:', error);
      throw error;
    }
  }

  // 獲取非活躍用戶
  static async getInactive(): Promise<User[]> {
    try {
      const users = await this.getAll();
      return users.filter(user => !user.active);
    } catch (error) {
      console.error('Failed to get inactive users:', error);
      throw error;
    }
  }

  // 激活用戶
  static async activateUser(id: number): Promise<User> {
    try {
      const user = await this.getById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return await this.update(id, { active: true });
    } catch (error) {
      console.error(`Failed to activate user ${id}:`, error);
      throw error;
    }
  }

  // 停用用戶
  static async deactivateUser(id: number): Promise<User> {
    try {
      const user = await this.getById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return await this.update(id, { active: false });
    } catch (error) {
      console.error(`Failed to deactivate user ${id}:`, error);
      throw error;
    }
  }

  // 驗證用戶數據
  static validateUserData(data: UserCreateRequest | UserUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.username || data.username.trim().length < 3) {
      errors.push('用戶名至少需要3個字符');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('請輸入有效的電子郵件地址');
    }

    if ('password' in data && data.password && data.password.length < 8) {
      errors.push('密碼至少需要8個字符');
    }

    if (data.username && !this.isValidUsername(data.username)) {
      errors.push('用戶名只能包含字母、數字和下劃線');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 驗證電子郵件格式
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 驗證用戶名格式
  private static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    return usernameRegex.test(username);
  }

  // 檢查用戶是否有特定權限
  static hasPermission(user: User, permission: string): boolean {
    return user.roles.some(role => 
      role.permissions.some(perm => perm.name === permission)
    );
  }

  // 檢查用戶是否有管理員權限
  static isAdministrator(user: User): boolean {
    return this.hasPermission(user, 'administration');
  }

  // 檢查用戶是否已過期
  static isExpired(user: User): boolean {
    if (!user.expires) return false;
    return new Date(user.expires) < new Date();
  }

  // 獲取用戶的顯示名稱
  static getDisplayName(user: User): string {
    return user.username || user.email || `User ${user.id}`;
  }

  // 文件轉換為base64
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  // 導出用戶數據
  static exportUsers(users: User[], format: 'csv' | 'json' = 'csv'): void {
    if (format === 'csv') {
      this.exportToCSV(users);
    } else {
      this.exportToJSON(users);
    }
  }

  // 導出為CSV
  private static exportToCSV(users: User[]): void {
    const headers = ['ID', '用戶名', '電子郵件', '活躍狀態', '角色', '過期日期', '創建日期', '更新日期'];
    const csvContent = [
      headers.join(','),
      ...users.map(user => [
        user.id,
        `"${user.username}"`,
        `"${user.email}"`,
        user.active ? '是' : '否',
        `"${user.roles.map(role => role.name).join('; ')}"`,
        user.expires ? new Date(user.expires).toLocaleDateString('zh-TW') : '',
        user.created_at ? new Date(user.created_at).toLocaleDateString('zh-TW') : '',
        user.updated_at ? new Date(user.updated_at).toLocaleDateString('zh-TW') : '',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // 導出為JSON
  private static exportToJSON(users: User[]): void {
    const jsonContent = JSON.stringify(users, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // 導入用戶數據
  static async importUsers(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const content = await this.readFileContent(file);
      const users = this.parseUserData(content, file.name);
      
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const user of users) {
        try {
          await this.create(user);
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to import user ${user.username}: ${error}`);
        }
      }

      return { success, failed, errors };
    } catch (error) {
      console.error('Failed to import users:', error);
      throw error;
    }
  }

  // 讀取文件內容
  private static readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // 解析用戶數據
  private static parseUserData(content: string, filename: string): UserCreateRequest[] {
    if (filename.endsWith('.csv')) {
      return this.parseCSV(content);
    } else if (filename.endsWith('.json')) {
      return this.parseJSON(content);
    } else {
      throw new Error('Unsupported file format. Please use CSV or JSON.');
    }
  }

  // 解析CSV數據
  private static parseCSV(content: string): UserCreateRequest[] {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const users: UserCreateRequest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const user: Record<string, string> = {};

      headers.forEach((header, index) => {
        user[header] = values[index] || '';
      });

      // 映射CSV列到用戶字段
      users.push({
        username: user['用戶名'] || user['username'] || '',
        email: user['電子郵件'] || user['email'] || '',
        password: user['密碼'] || user['password'] || '',
        active: user['活躍狀態'] === '是' || user['active'] === 'true',
        roles: [],
      });
    }

    return users;
  }

  // 解析JSON數據
  private static parseJSON(content: string): UserCreateRequest[] {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map(item => ({
          username: item.username || '',
          email: item.email || '',
          password: item.password || '',
          active: item.active !== false,
          roles: item.roles || [],
        }));
      } else {
        throw new Error('Invalid JSON format. Expected an array of users.');
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
}

export default UserService;
