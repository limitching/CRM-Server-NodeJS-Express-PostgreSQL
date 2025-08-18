import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { Contact, ContactCreateRequest, ContactUpdateRequest } from '../types';

// 聯繫人查詢參數接口
export interface ContactQueryParams {
  search?: string;
  position?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 聯繫人過濾器接口
export interface ContactFilters {
  position?: string[];
  accounts?: number[];
  createdDate?: {
    from: string;
    to: string;
  };
  updatedDate?: {
    from: string;
    to: string;
  };
}

// 聯繫人統計接口
export interface ContactStats {
  total: number;
  byPosition: Record<string, number>;
  byAccount: Record<string, number>;
  byMonth: Record<string, number>;
}

// 聯繫人服務類
export class ContactService {
  // 獲取所有聯繫人
  static async getAll(params?: ContactQueryParams): Promise<Contact[]> {
    try {
      const response = await apiClient.get<Contact[]>(
        API_CONFIG.ENDPOINTS.CONTACTS.ALL,
        { params }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw error;
    }
  }

  // 根據ID獲取聯繫人
  static async getById(id: number): Promise<Contact> {
    try {
      const contacts = await this.getAll();
      const contact = contacts.find(cont => cont.id === id);
      
      if (!contact) {
        throw new Error(`Contact with ID ${id} not found`);
      }
      
      return contact;
    } catch (error) {
      console.error(`Failed to fetch contact ${id}:`, error);
      throw error;
    }
  }

  // 創建新聯繫人
  static async create(contactData: ContactCreateRequest): Promise<Contact> {
    try {
      const response = await apiClient.post<Contact>(
        API_CONFIG.ENDPOINTS.CONTACTS.SAVE,
        { object: contactData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  }

  // 更新聯繫人
  static async update(id: number, contactData: ContactUpdateRequest): Promise<Contact> {
    try {
      const response = await apiClient.post<Contact>(
        API_CONFIG.ENDPOINTS.CONTACTS.SAVE,
        { object: { ...contactData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update contact ${id}:`, error);
      throw error;
    }
  }

  // 刪除聯繫人
  static async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.CONTACTS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete contact ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除聯繫人
  static async deleteMultiple(ids: number[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.delete(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete multiple contacts:', error);
      throw error;
    }
  }

  // 搜索聯繫人
  static async search(query: string, filters?: ContactFilters): Promise<Contact[]> {
    try {
      const allContacts = await this.getAll();
      
      const filteredContacts = allContacts.filter(contact => {
        // 文本搜索
        const searchMatch = query
          ? contact.first_name.toLowerCase().includes(query.toLowerCase()) ||
            contact.last_name.toLowerCase().includes(query.toLowerCase()) ||
            contact.email?.toLowerCase().includes(query.toLowerCase()) ||
            contact.phone?.includes(query) ||
            contact.position?.toLowerCase().includes(query.toLowerCase())
          : true;

        if (!searchMatch) return false;

        // 職位過濾
        if (filters?.position && filters.position.length > 0) {
          if (!contact.position || !filters.position.includes(contact.position)) {
            return false;
          }
        }

        // 帳戶過濾
        if (filters?.accounts && filters.accounts.length > 0) {
          const contactAccountIds = contact.accounts.map(acc => acc.id);
          const hasMatchingAccount = filters.accounts.some(accountId => 
            contactAccountIds.includes(accountId)
          );
          if (!hasMatchingAccount) {
            return false;
          }
        }

        // 創建日期過濾
        if (filters?.createdDate) {
          const createdDate = new Date(contact.created_at);
          const fromDate = new Date(filters.createdDate.from);
          const toDate = new Date(filters.createdDate.to);
          
          if (createdDate < fromDate || createdDate > toDate) {
            return false;
          }
        }

        // 更新日期過濾
        if (filters?.updatedDate) {
          const updatedDate = new Date(contact.updated_at);
          const fromDate = new Date(filters.updatedDate.from);
          const toDate = new Date(filters.updatedDate.to);
          
          if (updatedDate < fromDate || updatedDate > toDate) {
            return false;
          }
        }

        return true;
      });

      return filteredContacts;
    } catch (error) {
      console.error('Failed to search contacts:', error);
      throw error;
    }
  }

  // 獲取聯繫人統計
  static async getStats(): Promise<ContactStats> {
    try {
      const contacts = await this.getAll();
      
      const stats: ContactStats = {
        total: contacts.length,
        byPosition: {},
        byAccount: {},
        byMonth: {},
      };

      contacts.forEach(contact => {
        // 按職位統計
        if (contact.position) {
          stats.byPosition[contact.position] = (stats.byPosition[contact.position] || 0) + 1;
        }

        // 按帳戶統計
        contact.accounts.forEach(account => {
          const accountName = account.company_name;
          stats.byAccount[accountName] = (stats.byAccount[accountName] || 0) + 1;
        });

        // 按月份統計
        const month = new Date(contact.created_at).toISOString().slice(0, 7); // YYYY-MM
        stats.byMonth[month] = (stats.byMonth[month] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get contact stats:', error);
      throw error;
    }
  }

  // 獲取職位列表
  static async getPositions(): Promise<string[]> {
    try {
      const contacts = await this.getAll();
      const positions = new Set<string>();
      
      contacts.forEach(contact => {
        if (contact.position) {
          positions.add(contact.position);
        }
      });

      return Array.from(positions).sort();
    } catch (error) {
      console.error('Failed to get positions:', error);
      throw error;
    }
  }

  // 根據帳戶獲取聯繫人
  static async getByAccount(accountId: number): Promise<Contact[]> {
    try {
      const contacts = await this.getAll();
      return contacts.filter(contact => 
        contact.accounts.some(account => account.id === accountId)
      );
    } catch (error) {
      console.error(`Failed to get contacts for account ${accountId}:`, error);
      throw error;
    }
  }

  // 驗證聯繫人數據
  static validateContactData(data: ContactCreateRequest | ContactUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.first_name || data.first_name.trim().length < 2) {
      errors.push('名字至少需要2個字符');
    }

    if (!data.last_name || data.last_name.trim().length < 2) {
      errors.push('姓氏至少需要2個字符');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('請輸入有效的電子郵件地址');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('請輸入有效的電話號碼');
    }

    if (data.position && data.position.trim().length < 2) {
      errors.push('職位名稱至少需要2個字符');
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

  // 驗證電話號碼格式
  private static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''));
  }

  // 導出聯繫人數據
  static exportContacts(contacts: Contact[], format: 'csv' | 'json' = 'csv'): void {
    if (format === 'csv') {
      this.exportToCSV(contacts);
    } else {
      this.exportToJSON(contacts);
    }
  }

  // 導出為CSV
  private static exportToCSV(contacts: Contact[]): void {
    const headers = ['ID', '名字', '姓氏', '電子郵件', '電話', '職位', '關聯帳戶', '創建日期', '更新日期'];
    const csvContent = [
      headers.join(','),
      ...contacts.map(contact => [
        contact.id,
        `"${contact.first_name}"`,
        `"${contact.last_name}"`,
        contact.email ? `"${contact.email}"` : '',
        contact.phone ? `"${contact.phone}"` : '',
        contact.position ? `"${contact.position}"` : '',
        `"${contact.accounts.map(acc => acc.company_name).join('; ')}"`,
        new Date(contact.created_at).toLocaleDateString('zh-TW'),
        new Date(contact.updated_at).toLocaleDateString('zh-TW'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // 導出為JSON
  private static exportToJSON(contacts: Contact[]): void {
    const jsonContent = JSON.stringify(contacts, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // 導入聯繫人數據
  static async importContacts(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const content = await this.readFileContent(file);
      const contacts = this.parseContactData(content, file.name);
      
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const contact of contacts) {
        try {
          await this.create(contact);
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to import contact ${contact.first_name} ${contact.last_name}: ${error}`);
        }
      }

      return { success, failed, errors };
    } catch (error) {
      console.error('Failed to import contacts:', error);
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

  // 解析聯繫人數據
  private static parseContactData(content: string, filename: string): ContactCreateRequest[] {
    if (filename.endsWith('.csv')) {
      return this.parseCSV(content);
    } else if (filename.endsWith('.json')) {
      return this.parseJSON(content);
    } else {
      throw new Error('Unsupported file format. Please use CSV or JSON.');
    }
  }

  // 解析CSV數據
  private static parseCSV(content: string): ContactCreateRequest[] {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const contacts: ContactCreateRequest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const contact: Record<string, string> = {};

      headers.forEach((header, index) => {
        contact[header] = values[index] || '';
      });

      // 映射CSV列到聯繫人字段
      contacts.push({
        first_name: contact['名字'] || contact['first_name'] || '',
        last_name: contact['姓氏'] || contact['last_name'] || '',
        email: contact['電子郵件'] || contact['email'] || '',
        phone: contact['電話'] || contact['phone'] || '',
        position: contact['職位'] || contact['position'] || '',
        accounts: [],
      });
    }

    return contacts;
  }

  // 解析JSON數據
  private static parseJSON(content: string): ContactCreateRequest[] {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map(item => ({
          first_name: item.first_name || '',
          last_name: item.last_name || '',
          email: item.email || '',
          phone: item.phone || '',
          position: item.position || '',
          accounts: item.accounts || [],
        }));
      } else {
        throw new Error('Invalid JSON format. Expected an array of contacts.');
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
}

export default ContactService;
