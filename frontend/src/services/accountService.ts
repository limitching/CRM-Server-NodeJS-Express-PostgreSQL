import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { Account, AccountCreateRequest, AccountUpdateRequest } from '../types';

// 帳戶查詢參數接口
export interface AccountQueryParams {
  search?: string;
  industry?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 帳戶過濾器接口
export interface AccountFilters {
  industry?: string[];
  status?: string[];
  createdDate?: {
    from: string;
    to: string;
  };
  updatedDate?: {
    from: string;
    to: string;
  };
}

// 帳戶統計接口
export interface AccountStats {
  total: number;
  byIndustry: Record<string, number>;
  byStatus: Record<string, number>;
  byMonth: Record<string, number>;
}

// 帳戶服務類
export class AccountService {
  // 獲取所有帳戶
  static async getAll(params?: AccountQueryParams): Promise<Account[]> {
    try {
      const response = await apiClient.get<Account[]>(
        API_CONFIG.ENDPOINTS.ACCOUNTS.ALL,
        { params }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  }

  // 根據ID獲取帳戶
  static async getById(id: number): Promise<Account> {
    try {
      const accounts = await this.getAll();
      const account = accounts.find(acc => acc.id === id);
      
      if (!account) {
        throw new Error(`Account with ID ${id} not found`);
      }
      
      return account;
    } catch (error) {
      console.error(`Failed to fetch account ${id}:`, error);
      throw error;
    }
  }

  // 創建新帳戶
  static async create(accountData: AccountCreateRequest): Promise<Account> {
    try {
      const response = await apiClient.post<Account>(
        API_CONFIG.ENDPOINTS.ACCOUNTS.SAVE,
        { object: accountData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  // 更新帳戶
  static async update(id: number, accountData: AccountUpdateRequest): Promise<Account> {
    try {
      const response = await apiClient.post<Account>(
        API_CONFIG.ENDPOINTS.ACCOUNTS.SAVE,
        { object: { ...accountData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update account ${id}:`, error);
      throw error;
    }
  }

  // 刪除帳戶
  static async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.ACCOUNTS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete account ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除帳戶
  static async deleteMultiple(ids: number[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.delete(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete multiple accounts:', error);
      throw error;
    }
  }

  // 上傳帳戶文檔
  static async uploadDocument(accountId: number, file: File): Promise<{ url: string }> {
    try {
      // 將文件轉換為base64
      const base64 = await this.fileToBase64(file);
      
      const response = await apiClient.post<{ url: string }>(
        API_CONFIG.ENDPOINTS.ACCOUNTS.UPLOAD,
        { base64 }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to upload document for account ${accountId}:`, error);
      throw error;
    }
  }

  // 搜索帳戶
  static async search(query: string, filters?: AccountFilters): Promise<Account[]> {
    try {
      const allAccounts = await this.getAll();
      
      const filteredAccounts = allAccounts.filter(account => {
        // 文本搜索
        const searchMatch = query
          ? account.company_name.toLowerCase().includes(query.toLowerCase()) ||
            account.industry?.toLowerCase().includes(query.toLowerCase()) ||
            account.status?.toLowerCase().includes(query.toLowerCase())
          : true;

        if (!searchMatch) return false;

        // 行業過濾
        if (filters?.industry && filters.industry.length > 0) {
          if (!account.industry || !filters.industry.includes(account.industry)) {
            return false;
          }
        }

        // 狀態過濾
        if (filters?.status && filters.status.length > 0) {
          if (!account.status || !filters.status.includes(account.status)) {
            return false;
          }
        }

        // 創建日期過濾
        if (filters?.createdDate) {
          const createdDate = new Date(account.created_at);
          const fromDate = new Date(filters.createdDate.from);
          const toDate = new Date(filters.createdDate.to);
          
          if (createdDate < fromDate || createdDate > toDate) {
            return false;
          }
        }

        // 更新日期過濾
        if (filters?.updatedDate) {
          const updatedDate = new Date(account.updated_at);
          const fromDate = new Date(filters.updatedDate.from);
          const toDate = new Date(filters.updatedDate.to);
          
          if (updatedDate < fromDate || updatedDate > toDate) {
            return false;
          }
        }

        return true;
      });

      return filteredAccounts;
    } catch (error) {
      console.error('Failed to search accounts:', error);
      throw error;
    }
  }

  // 獲取帳戶統計
  static async getStats(): Promise<AccountStats> {
    try {
      const accounts = await this.getAll();
      
      const stats: AccountStats = {
        total: accounts.length,
        byIndustry: {},
        byStatus: {},
        byMonth: {},
      };

      accounts.forEach(account => {
        // 按行業統計
        if (account.industry) {
          stats.byIndustry[account.industry] = (stats.byIndustry[account.industry] || 0) + 1;
        }

        // 按狀態統計
        if (account.status) {
          stats.byStatus[account.status] = (stats.byStatus[account.status] || 0) + 1;
        }

        // 按月份統計
        const month = new Date(account.created_at).toISOString().slice(0, 7); // YYYY-MM
        stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get account stats:', error);
      throw error;
    }
  }

  // 獲取行業列表
  static async getIndustries(): Promise<string[]> {
    try {
      const accounts = await this.getAll();
      const industries = new Set<string>();
      
      accounts.forEach(account => {
        if (account.industry) {
          industries.add(account.industry);
        }
      });

      return Array.from(industries).sort();
    } catch (error) {
      console.error('Failed to get industries:', error);
      throw error;
    }
  }

  // 獲取狀態列表
  static async getStatuses(): Promise<string[]> {
    try {
      const accounts = await this.getAll();
      const statuses = new Set<string>();
      
      accounts.forEach(account => {
        if (account.status) {
          statuses.add(account.status);
        }
      });

      return Array.from(statuses).sort();
    } catch (error) {
      console.error('Failed to get statuses:', error);
      throw error;
    }
  }

  // 驗證帳戶數據
  static validateAccountData(data: AccountCreateRequest | AccountUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.company_name || data.company_name.trim().length < 2) {
      errors.push('公司名稱至少需要2個字符');
    }

    if (data.industry && data.industry.trim().length < 2) {
      errors.push('行業名稱至少需要2個字符');
    }

    if (data.status && data.status.trim().length < 2) {
      errors.push('狀態名稱至少需要2個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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

  // 導出帳戶數據
  static exportAccounts(accounts: Account[], format: 'csv' | 'json' = 'csv'): void {
    if (format === 'csv') {
      this.exportToCSV(accounts);
    } else {
      this.exportToJSON(accounts);
    }
  }

  // 導出為CSV
  private static exportToCSV(accounts: Account[]): void {
    const headers = ['ID', '公司名稱', '行業', '狀態', '創建日期', '更新日期'];
    const csvContent = [
      headers.join(','),
      ...accounts.map(account => [
        account.id,
        `"${account.company_name}"`,
        account.industry ? `"${account.industry}"` : '',
        account.status ? `"${account.status}"` : '',
        new Date(account.created_at).toLocaleDateString('zh-TW'),
        new Date(account.updated_at).toLocaleDateString('zh-TW'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `accounts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // 導出為JSON
  private static exportToJSON(accounts: Account[]): void {
    const jsonContent = JSON.stringify(accounts, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `accounts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }
}

export default AccountService;
