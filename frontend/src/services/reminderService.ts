import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { Reminder } from '../types';

// 提醒創建/更新請求接口
export interface ReminderCreateRequest {
  title: string;
  description?: string;
  due_date: Date;
  priority: 'low' | 'medium' | 'high';
  user_id: number;
  completed?: boolean;
}

export interface ReminderUpdateRequest extends ReminderCreateRequest {
  id: number;
}

// 提醒查詢參數接口
export interface ReminderQueryParams {
  search?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  user_id?: number;
  due_date_from?: string;
  due_date_to?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 提醒過濾器接口
export interface ReminderFilters {
  priority?: ('low' | 'medium' | 'high')[];
  completed?: boolean[];
  user_id?: number[];
  due_date_range?: {
    from: string;
    to: string;
  };
  created_date_range?: {
    from: string;
    to: string;
  };
}

// 提醒統計接口
export interface ReminderStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  by_priority: Record<string, number>;
  by_user: Record<string, number>;
  by_month: Record<string, number>;
}

// 提醒服務類
export class ReminderService {
  // 獲取所有提醒
  static async getAll(params?: ReminderQueryParams): Promise<Reminder[]> {
    try {
      const response = await apiClient.get<Reminder[]>(
        API_CONFIG.ENDPOINTS.REMINDERS.ALL,
        { params }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      throw error;
    }
  }

  // 根據ID獲取提醒
  static async getById(id: number): Promise<Reminder> {
    try {
      const reminders = await this.getAll();
      const reminder = reminders.find(rem => rem.id === id);
      
      if (!reminder) {
        throw new Error(`Reminder with ID ${id} not found`);
      }
      
      return reminder;
    } catch (error) {
      console.error(`Failed to fetch reminder ${id}:`, error);
      throw error;
    }
  }

  // 創建新提醒
  static async create(reminderData: ReminderCreateRequest): Promise<Reminder> {
    try {
      const response = await apiClient.post<Reminder>(
        API_CONFIG.ENDPOINTS.REMINDERS.SAVE,
        { object: reminderData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create reminder:', error);
      throw error;
    }
  }

  // 更新提醒
  static async update(id: number, reminderData: ReminderUpdateRequest): Promise<Reminder> {
    try {
      const response = await apiClient.post<Reminder>(
        API_CONFIG.ENDPOINTS.REMINDERS.SAVE,
        { object: { ...reminderData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update reminder ${id}:`, error);
      throw error;
    }
  }

  // 刪除提醒
  static async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.REMINDERS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete reminder ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除提醒
  static async deleteMultiple(ids: number[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.delete(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete multiple reminders:', error);
      throw error;
    }
  }

  // 標記提醒為完成
  static async markAsCompleted(id: number): Promise<Reminder> {
    try {
      const reminder = await this.getById(id);
      return await this.update(id, { ...reminder, completed: true });
    } catch (error) {
      console.error(`Failed to mark reminder ${id} as completed:`, error);
      throw error;
    }
  }

  // 標記提醒為未完成
  static async markAsIncomplete(id: number): Promise<Reminder> {
    try {
      const reminder = await this.getById(id);
      return await this.update(id, { ...reminder, completed: false });
    } catch (error) {
      console.error(`Failed to mark reminder ${id} as incomplete:`, error);
      throw error;
    }
  }

  // 搜索提醒
  static async search(query: string, filters?: ReminderFilters): Promise<Reminder[]> {
    try {
      const allReminders = await this.getAll();
      
      const filteredReminders = allReminders.filter(reminder => {
        // 文本搜索
        const searchMatch = query
          ? reminder.title.toLowerCase().includes(query.toLowerCase()) ||
            reminder.description?.toLowerCase().includes(query.toLowerCase())
          : true;

        if (!searchMatch) return false;

        // 優先級過濾
        if (filters?.priority && filters.priority.length > 0) {
          if (!filters.priority.includes(reminder.priority)) {
            return false;
          }
        }

        // 完成狀態過濾
        if (filters?.completed && filters.completed.length > 0) {
          if (!filters.completed.includes(reminder.completed)) {
            return false;
          }
        }

        // 用戶過濾
        if (filters?.user_id && filters.user_id.length > 0) {
          if (!filters.user_id.includes(reminder.user_id)) {
            return false;
          }
        }

        // 到期日期範圍過濾
        if (filters?.due_date_range) {
          const dueDate = new Date(reminder.due_date);
          const fromDate = new Date(filters.due_date_range.from);
          const toDate = new Date(filters.due_date_range.to);
          
          if (dueDate < fromDate || dueDate > toDate) {
            return false;
          }
        }

        // 創建日期範圍過濾
        if (filters?.created_date_range) {
          const createdDate = new Date(reminder.created_at);
          const fromDate = new Date(filters.created_date_range.from);
          const toDate = new Date(filters.created_date_range.to);
          
          if (createdDate < fromDate || createdDate > toDate) {
            return false;
          }
        }

        return true;
      });

      return filteredReminders;
    } catch (error) {
      console.error('Failed to search reminders:', error);
      throw error;
    }
  }

  // 獲取提醒統計
  static async getStats(): Promise<ReminderStats> {
    try {
      const reminders = await this.getAll();
      
      const stats: ReminderStats = {
        total: reminders.length,
        completed: 0,
        pending: 0,
        overdue: 0,
        by_priority: {},
        by_user: {},
        by_month: {},
      };

      const now = new Date();

      reminders.forEach(reminder => {
        // 完成狀態統計
        if (reminder.completed) {
          stats.completed++;
        } else {
          stats.pending++;
          
          // 檢查是否過期
          if (new Date(reminder.due_date) < now) {
            stats.overdue++;
          }
        }

        // 按優先級統計
        stats.by_priority[reminder.priority] = (stats.by_priority[reminder.priority] || 0) + 1;

        // 按用戶統計
        const userKey = `user_${reminder.user_id}`;
        stats.by_user[userKey] = (stats.by_user[userKey] || 0) + 1;

        // 按月份統計
        const month = new Date(reminder.created_at).toISOString().slice(0, 7); // YYYY-MM
        stats.by_month[month] = (stats.by_month[month] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get reminder stats:', error);
      throw error;
    }
  }

  // 根據用戶獲取提醒
  static async getByUser(userId: number): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      return reminders.filter(rem => rem.user_id === userId);
    } catch (error) {
      console.error(`Failed to get reminders for user ${userId}:`, error);
      throw error;
    }
  }

  // 獲取完成的提醒
  static async getCompleted(): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      return reminders.filter(rem => rem.completed);
    } catch (error) {
      console.error('Failed to get completed reminders:', error);
      throw error;
    }
  }

  // 獲取待完成的提醒
  static async getPending(): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      return reminders.filter(rem => !rem.completed);
    } catch (error) {
      console.error('Failed to get pending reminders:', error);
      throw error;
    }
  }

  // 獲取過期的提醒
  static async getOverdue(): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      const now = new Date();
      
      return reminders.filter(rem => 
        !rem.completed && new Date(rem.due_date) < now
      );
    } catch (error) {
      console.error('Failed to get overdue reminders:', error);
      throw error;
    }
  }

  // 獲取即將到期的提醒
  static async getUpcoming(daysThreshold: number = 7): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      const now = new Date();
      const thresholdDate = new Date(now.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
      
      return reminders.filter(rem => 
        !rem.completed && 
        new Date(rem.due_date) >= now && 
        new Date(rem.due_date) <= thresholdDate
      );
    } catch (error) {
      console.error('Failed to get upcoming reminders:', error);
      throw error;
    }
  }

  // 根據優先級獲取提醒
  static async getByPriority(priority: 'low' | 'medium' | 'high'): Promise<Reminder[]> {
    try {
      const reminders = await this.getAll();
      return reminders.filter(rem => rem.priority === priority);
    } catch (error) {
      console.error(`Failed to get reminders by priority ${priority}:`, error);
      throw error;
    }
  }

  // 驗證提醒數據
  static validateReminderData(data: ReminderCreateRequest | ReminderUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length < 2) {
      errors.push('提醒標題至少需要2個字符');
    }

    if (data.description && data.description.trim().length < 5) {
      errors.push('提醒描述至少需要5個字符');
    }

    if (!data.due_date) {
      errors.push('請設置到期日期');
    } else if (new Date(data.due_date) < new Date()) {
      errors.push('到期日期不能是過去的日期');
    }

    if (!data.priority || !['low', 'medium', 'high'].includes(data.priority)) {
      errors.push('請選擇有效的優先級');
    }

    if (!data.user_id || data.user_id <= 0) {
      errors.push('請選擇有效的用戶');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 獲取優先級選項
  static getPriorityOptions(): Array<{ value: 'low' | 'medium' | 'high'; label: string; color: string }> {
    return [
      { value: 'low', label: '低', color: '#4caf50' },
      { value: 'medium', label: '中', color: '#ff9800' },
      { value: 'high', label: '高', color: '#f44336' },
    ];
  }

  // 獲取優先級標籤
  static getPriorityLabel(priority: 'low' | 'medium' | 'high'): string {
    const options = this.getPriorityOptions();
    const option = options.find(opt => opt.value === priority);
    return option ? option.label : priority;
  }

  // 獲取優先級顏色
  static getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
    const options = this.getPriorityOptions();
    const option = options.find(opt => opt.value === priority);
    return option ? option.color : '#666';
  }

  // 檢查提醒是否過期
  static isOverdue(reminder: Reminder): boolean {
    if (reminder.completed) return false;
    return new Date(reminder.due_date) < new Date();
  }

  // 檢查提醒是否即將到期
  static isUpcoming(reminder: Reminder, daysThreshold: number = 3): boolean {
    if (reminder.completed) return false;
    
    const now = new Date();
    const dueDate = new Date(reminder.due_date);
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= daysThreshold;
  }

  // 獲取提醒的剩餘天數
  static getRemainingDays(reminder: Reminder): number {
    if (reminder.completed) return 0;
    
    const now = new Date();
    const dueDate = new Date(reminder.due_date);
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 獲取提醒的狀態
  static getReminderStatus(reminder: Reminder): 'completed' | 'overdue' | 'upcoming' | 'normal' {
    if (reminder.completed) return 'completed';
    if (this.isOverdue(reminder)) return 'overdue';
    if (this.isUpcoming(reminder)) return 'upcoming';
    return 'normal';
  }

  // 導出提醒數據
  static exportReminders(reminders: Reminder[], format: 'csv' | 'json' = 'csv'): void {
    if (format === 'csv') {
      this.exportToCSV(reminders);
    } else {
      this.exportToJSON(reminders);
    }
  }

  // 導出為CSV
  private static exportToCSV(reminders: Reminder[]): void {
    const headers = ['ID', '標題', '描述', '到期日期', '優先級', '完成狀態', '用戶ID', '創建日期', '更新日期'];
    const csvContent = [
      headers.join(','),
      ...reminders.map(reminder => [
        reminder.id,
        `"${reminder.title}"`,
        reminder.description ? `"${reminder.description}"` : '',
        new Date(reminder.due_date).toLocaleDateString('zh-TW'),
        reminder.priority,
        reminder.completed ? '是' : '否',
        reminder.user_id,
        new Date(reminder.created_at).toLocaleDateString('zh-TW'),
        new Date(reminder.updated_at).toLocaleDateString('zh-TW'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reminders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // 導出為JSON
  private static exportToJSON(reminders: Reminder[]): void {
    const jsonContent = JSON.stringify(reminders, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reminders_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // 導入提醒數據
  static async importReminders(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    try {
      const content = await this.readFileContent(file);
      const reminders = this.parseReminderData(content, file.name);
      
      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const reminder of reminders) {
        try {
          await this.create(reminder);
          success++;
        } catch (error) {
          failed++;
          errors.push(`Failed to import reminder ${reminder.title}: ${error}`);
        }
      }

      return { success, failed, errors };
    } catch (error) {
      console.error('Failed to import reminders:', error);
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

  // 解析提醒數據
  private static parseReminderData(content: string, filename: string): ReminderCreateRequest[] {
    if (filename.endsWith('.csv')) {
      return this.parseCSV(content);
    } else if (filename.endsWith('.json')) {
      return this.parseJSON(content);
    } else {
      throw new Error('Unsupported file format. Please use CSV or JSON.');
    }
  }

  // 解析CSV數據
  private static parseCSV(content: string): ReminderCreateRequest[] {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const reminders: ReminderCreateRequest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const reminder: Record<string, string> = {};

      headers.forEach((header, index) => {
        reminder[header] = values[index] || '';
      });

      // 映射CSV列到提醒字段
      reminders.push({
        title: reminder['標題'] || reminder['title'] || '',
        description: reminder['描述'] || reminder['description'] || '',
        due_date: new Date(reminder['到期日期'] || reminder['due_date'] || Date.now()),
        priority: (reminder['優先級'] || reminder['priority'] || 'medium') as 'low' | 'medium' | 'high',
        user_id: parseInt(reminder['用戶ID'] || reminder['user_id'] || '1'),
        completed: false,
      });
    }

    return reminders;
  }

  // 解析JSON數據
  private static parseJSON(content: string): ReminderCreateRequest[] {
    try {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        return data.map(item => ({
          title: item.title || '',
          description: item.description || '',
          due_date: new Date(item.due_date || Date.now()),
          priority: (item.priority || 'medium') as 'low' | 'medium' | 'high',
          user_id: item.user_id || 1,
          completed: false,
        }));
      } else {
        throw new Error('Invalid JSON format. Expected an array of reminders.');
      }
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error}`);
    }
  }
}

export default ReminderService;
