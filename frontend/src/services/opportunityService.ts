import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { Opportunity, OpportunityCreateRequest, OpportunityUpdateRequest } from '../types';

// 機會查詢參數接口
export interface OpportunityQueryParams {
  search?: string;
  status_id?: number;
  user_id?: number;
  company_id?: number;
  currency?: 'USD' | 'EUR';
  is_active?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 機會過濾器接口
export interface OpportunityFilters {
  status_id?: number[];
  user_id?: number[];
  company_id?: number[];
  currency?: ('USD' | 'EUR')[];
  value_range?: {
    min: number;
    max: number;
  };
  probability_range?: {
    min: number;
    max: number;
  };
  expected_close_date?: {
    from: string;
    to: string;
  };
  created_date?: {
    from: string;
    to: string;
  };
}

// 機會統計接口
export interface OpportunityStats {
  total: number;
  total_value: number;
  by_status: Record<string, number>;
  by_user: Record<string, number>;
  by_company: Record<string, number>;
  by_currency: Record<string, number>;
  by_month: Record<string, number>;
}

// 機會重新排序數據接口
export interface OpportunityReorderData {
  id: number;
  status_id: number;
  order: number;
}

// 機會服務類
export class OpportunityService {
  // 獲取所有機會
  static async getAll(params?: OpportunityQueryParams): Promise<Opportunity[]> {
    try {
      const response = await apiClient.get<Opportunity[]>(
        API_CONFIG.ENDPOINTS.OPPORTUNITIES.ALL,
        { params }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error);
      throw error;
    }
  }

  // 根據ID獲取機會
  static async getById(id: number): Promise<Opportunity> {
    try {
      const opportunities = await this.getAll();
      const opportunity = opportunities.find(opp => opp.id === id);
      
      if (!opportunity) {
        throw new Error(`Opportunity with ID ${id} not found`);
      }
      
      return opportunity;
    } catch (error) {
      console.error(`Failed to fetch opportunity ${id}:`, error);
      throw error;
    }
  }

  // 創建新機會
  static async create(opportunityData: OpportunityCreateRequest): Promise<Opportunity> {
    try {
      const response = await apiClient.post<Opportunity>(
        API_CONFIG.ENDPOINTS.OPPORTUNITIES.SAVE,
        { object: opportunityData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create opportunity:', error);
      throw error;
    }
  }

  // 更新機會
  static async update(id: number, opportunityData: OpportunityUpdateRequest): Promise<Opportunity> {
    try {
      const response = await apiClient.post<Opportunity>(
        API_CONFIG.ENDPOINTS.OPPORTUNITIES.SAVE,
        { object: { ...opportunityData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update opportunity ${id}:`, error);
      throw error;
    }
  }

  // 刪除機會
  static async delete(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.OPPORTUNITIES.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete opportunity ${id}:`, error);
      throw error;
    }
  }

  // 批量刪除機會
  static async deleteMultiple(ids: number[]): Promise<void> {
    try {
      const deletePromises = ids.map(id => this.delete(id));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete multiple opportunities:', error);
      throw error;
    }
  }

  // 重新排序機會
  static async reorder(reorderData: OpportunityReorderData[]): Promise<void> {
    try {
      const response = await apiClient.post<void>(
        API_CONFIG.ENDPOINTS.OPPORTUNITIES.REORDER,
        reorderData
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to reorder opportunities:', error);
      throw error;
    }
  }

  // 批量歸檔機會
  static async archiveMultiple(opportunities: Opportunity[]): Promise<void> {
    try {
      const response = await apiClient.post<void>(
        API_CONFIG.ENDPOINTS.OPPORTUNITIES.ARCHIVE_ALL,
        { opportunities }
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to archive opportunities:', error);
      throw error;
    }
  }

  // 搜索機會
  static async search(query: string, filters?: OpportunityFilters): Promise<Opportunity[]> {
    try {
      const allOpportunities = await this.getAll();
      
      const filteredOpportunities = allOpportunities.filter(opportunity => {
        // 文本搜索
        const searchMatch = query
          ? opportunity.name.toLowerCase().includes(query.toLowerCase())
          : true;

        if (!searchMatch) return false;

        // 狀態過濾
        if (filters?.status_id && filters.status_id.length > 0) {
          if (!filters.status_id.includes(opportunity.status_id)) {
            return false;
          }
        }

        // 用戶過濾
        if (filters?.user_id && filters.user_id.length > 0) {
          if (!filters.user_id.includes(opportunity.user_id)) {
            return false;
          }
        }

        // 公司過濾
        if (filters?.company_id && filters.company_id.length > 0) {
          if (!filters.company_id.includes(opportunity.company_id)) {
            return false;
          }
        }

        // 貨幣過濾
        if (filters?.currency && filters.currency.length > 0) {
          if (!filters.currency.includes(opportunity.currency)) {
            return false;
          }
        }

        // 價值範圍過濾
        if (filters?.value_range) {
          if (opportunity.value < filters.value_range.min || 
              opportunity.value > filters.value_range.max) {
            return false;
          }
        }

        // 概率範圍過濾
        if (filters?.probability_range) {
          if (opportunity.probability < filters.probability_range.min || 
              opportunity.probability > filters.probability_range.max) {
            return false;
          }
        }

        // 預期關閉日期過濾
        if (filters?.expected_close_date) {
          const closeDate = new Date(opportunity.expected_close_date);
          const fromDate = new Date(filters.expected_close_date.from);
          const toDate = new Date(filters.expected_close_date.to);
          
          if (closeDate < fromDate || closeDate > toDate) {
            return false;
          }
        }

        // 創建日期過濾
        if (filters?.created_date) {
          const createdDate = new Date(opportunity.created_at);
          const fromDate = new Date(filters.created_date.from);
          const toDate = new Date(filters.created_date.to);
          
          if (createdDate < fromDate || createdDate > toDate) {
            return false;
          }
        }

        return true;
      });

      return filteredOpportunities;
    } catch (error) {
      console.error('Failed to search opportunities:', error);
      throw error;
    }
  }

  // 獲取機會統計
  static async getStats(): Promise<OpportunityStats> {
    try {
      const opportunities = await this.getAll();
      
      const stats: OpportunityStats = {
        total: opportunities.length,
        total_value: 0,
        by_status: {},
        by_user: {},
        by_company: {},
        by_currency: {},
        by_month: {},
      };

      opportunities.forEach(opportunity => {
        // 總價值
        stats.total_value += opportunity.value;

        // 按狀態統計
        const statusKey = `status_${opportunity.status_id}`;
        stats.by_status[statusKey] = (stats.by_status[statusKey] || 0) + 1;

        // 按用戶統計
        const userKey = `user_${opportunity.user_id}`;
        stats.by_user[userKey] = (stats.by_user[userKey] || 0) + 1;

        // 按公司統計
        const companyKey = `company_${opportunity.company_id}`;
        stats.by_company[companyKey] = (stats.by_company[companyKey] || 0) + 1;

        // 按貨幣統計
        stats.by_currency[opportunity.currency] = (stats.by_currency[opportunity.currency] || 0) + 1;

        // 按月份統計
        const month = new Date(opportunity.created_at).toISOString().slice(0, 7); // YYYY-MM
        stats.by_month[month] = (stats.by_month[month] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get opportunity stats:', error);
      throw error;
    }
  }

  // 根據狀態獲取機會
  static async getByStatus(statusId: number): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getAll();
      return opportunities
        .filter(opp => opp.status_id === statusId)
        .sort((a, b) => a.order - b.order);
    } catch (error) {
      console.error(`Failed to get opportunities by status ${statusId}:`, error);
      throw error;
    }
  }

  // 根據用戶獲取機會
  static async getByUser(userId: number): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getAll();
      return opportunities.filter(opp => opp.user_id === userId);
    } catch (error) {
      console.error(`Failed to get opportunities by user ${userId}:`, error);
      throw error;
    }
  }

  // 根據公司獲取機會
  static async getByCompany(companyId: number): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getAll();
      return opportunities.filter(opp => opp.company_id === companyId);
    } catch (error) {
      console.error(`Failed to get opportunities by company ${companyId}:`, error);
      throw error;
    }
  }

  // 獲取活躍機會
  static async getActive(): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getAll();
      return opportunities.filter(opp => opp.is_active);
    } catch (error) {
      console.error('Failed to get active opportunities:', error);
      throw error;
    }
  }

  // 獲取歸檔機會
  static async getArchived(): Promise<Opportunity[]> {
    try {
      const opportunities = await this.getAll();
      return opportunities.filter(opp => !opp.is_active);
    } catch (error) {
      console.error('Failed to get archived opportunities:', error);
      throw error;
    }
  }

  // 驗證機會數據
  static validateOpportunityData(data: OpportunityCreateRequest | OpportunityUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('機會名稱至少需要2個字符');
    }

    if (data.value !== undefined && data.value < 0) {
      errors.push('機會價值不能為負數');
    }

    if (data.probability !== undefined && (data.probability < 0 || data.probability > 1)) {
      errors.push('概率必須在0到1之間');
    }

    if (data.expected_close_date && new Date(data.expected_close_date) < new Date()) {
      errors.push('預期關閉日期不能是過去的日期');
    }

    if (data.currency && !['USD', 'EUR'].includes(data.currency)) {
      errors.push('貨幣必須是USD或EUR');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 計算機會的加權價值
  static calculateWeightedValue(opportunity: Opportunity): number {
    return opportunity.value * opportunity.probability;
  }

  // 獲取機會的階段進度
  static getStageProgress(opportunity: Opportunity, totalStages: number): number {
    // 假設order字段表示階段順序，從1開始
    return Math.round((opportunity.order / totalStages) * 100);
  }

  // 檢查機會是否即將到期
  static isExpiringSoon(opportunity: Opportunity, daysThreshold: number = 30): boolean {
    const closeDate = new Date(opportunity.expected_close_date);
    const now = new Date();
    const diffTime = closeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= daysThreshold && diffDays >= 0;
  }

  // 導出機會數據
  static exportOpportunities(opportunities: Opportunity[], format: 'csv' | 'json' = 'csv'): void {
    if (format === 'csv') {
      this.exportToCSV(opportunities);
    } else {
      this.exportToJSON(opportunities);
    }
  }

  // 導出為CSV
  private static exportToCSV(opportunities: Opportunity[]): void {
    const headers = ['ID', '名稱', '價值', '貨幣', '概率', '狀態ID', '用戶ID', '公司ID', '預期關閉日期', '順序', '是否活躍', '創建日期', '更新日期'];
    const csvContent = [
      headers.join(','),
      ...opportunities.map(opportunity => [
        opportunity.id,
        `"${opportunity.name}"`,
        opportunity.value,
        opportunity.currency,
        opportunity.probability,
        opportunity.status_id,
        opportunity.user_id,
        opportunity.company_id,
        new Date(opportunity.expected_close_date).toLocaleDateString('zh-TW'),
        opportunity.order,
        opportunity.is_active ? '是' : '否',
        new Date(opportunity.created_at).toLocaleDateString('zh-TW'),
        new Date(opportunity.updated_at).toLocaleDateString('zh-TW'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `opportunities_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  // 導出為JSON
  private static exportToJSON(opportunities: Opportunity[]): void {
    const jsonContent = JSON.stringify(opportunities, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `opportunities_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // 獲取機會管道視圖數據
  static async getPipelineView(): Promise<Record<string, Opportunity[]>> {
    try {
      const opportunities = await this.getAll();
      const pipeline: Record<string, Opportunity[]> = {};

      // 按狀態分組
      opportunities.forEach(opportunity => {
        const statusKey = `status_${opportunity.status_id}`;
        if (!pipeline[statusKey]) {
          pipeline[statusKey] = [];
        }
        pipeline[statusKey].push(opportunity);
      });

      // 按順序排序每個狀態組
      Object.keys(pipeline).forEach(statusKey => {
        pipeline[statusKey].sort((a, b) => a.order - b.order);
      });

      return pipeline;
    } catch (error) {
      console.error('Failed to get pipeline view:', error);
      throw error;
    }
  }
}

export default OpportunityService;
