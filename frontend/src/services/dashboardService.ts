import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { 
  DashboardMetrics, 
  DashboardCalculationResult,
  OpportunityMetrics,
  UserMetrics,
  CompanyMetrics,
  StatusMetrics
} from '../types/dashboard';

// 儀表板計算參數接口
export interface DashboardParams {
  date_from: string;
  date_to: string;
  currency: 'ALL' | 'USD' | 'EUR';
  showBy: 'User' | 'Company' | 'Status' | 'Month' | 'Year' | 'Currency';
  value?: string;
  by?: 'User' | 'Company' | 'Status' | 'Month' | 'Year' | 'Currency';
}

// 儀表板服務類
export class DashboardService {
  // 獲取基礎儀表板數據
  static async getBasicMetrics(params: DashboardParams): Promise<DashboardMetrics> {
    try {
      const response = await apiClient.post<DashboardCalculationResult>(
        API_CONFIG.ENDPOINTS.DASHBOARD.CALCULATE,
        { object: params }
      );

      if (response.success) {
        return this.transformBasicMetrics(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch basic dashboard metrics:', error);
      throw error;
    }
  }

  // 獲取高級儀表板數據（多維度）
  static async getAdvancedMetrics(params: DashboardParams): Promise<DashboardCalculationResult[]> {
    try {
      const response = await apiClient.post<DashboardCalculationResult[]>(
        API_CONFIG.ENDPOINTS.DASHBOARD.CALCULATE_V2,
        { object: params }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch advanced dashboard metrics:', error);
      throw error;
    }
  }

  // 獲取按用戶分組的指標
  static async getMetricsByUser(params: DashboardParams): Promise<UserMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'User'
    });
    return metrics.userMetrics || [];
  }

  // 獲取按公司分組的指標
  static async getMetricsByCompany(params: DashboardParams): Promise<CompanyMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'Company'
    });
    return metrics.companyMetrics || [];
  }

  // 獲取按狀態分組的指標
  static async getMetricsByStatus(params: DashboardParams): Promise<StatusMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'Status'
    });
    return metrics.statusMetrics || [];
  }

  // 獲取按月份分組的指標
  static async getMetricsByMonth(params: DashboardParams): Promise<OpportunityMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'Month'
    });
    return metrics.monthMetrics || [];
  }

  // 獲取按年份分組的指標
  static async getMetricsByYear(params: DashboardParams): Promise<OpportunityMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'Year'
    });
    return metrics.yearMetrics || [];
  }

  // 獲取按貨幣分組的指標
  static async getMetricsByCurrency(params: DashboardParams): Promise<OpportunityMetrics[]> {
    const metrics = await this.getBasicMetrics({
      ...params,
      showBy: 'Currency'
    });
    return metrics.currencyMetrics || [];
  }

  // 轉換基礎指標數據
  private static transformBasicMetrics(data: DashboardCalculationResult): DashboardMetrics {
    return {
      totalOpportunities: data.totalOpportunities || 0,
      totalValue: data.totalValue || 0,
      currency: data.currency || 'USD',
      userMetrics: data.userMetrics || [],
      companyMetrics: data.companyMetrics || [],
      statusMetrics: data.statusMetrics || [],
      monthMetrics: data.monthMetrics || [],
      yearMetrics: data.yearMetrics || [],
      currencyMetrics: data.currencyMetrics || [],
      lastUpdated: new Date(),
    };
  }

  // 獲取默認日期範圍（當前月份）
  static getDefaultDateRange(): { date_from: string; date_to: string } {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      date_from: firstDay.toISOString().split('T')[0],
      date_to: lastDay.toISOString().split('T')[0],
    };
  }

  // 獲取預定義日期範圍
  static getPredefinedDateRanges() {
    const now = new Date();
    
    return {
      today: {
        label: '今天',
        date_from: now.toISOString().split('T')[0],
        date_to: now.toISOString().split('T')[0],
      },
      yesterday: {
        label: '昨天',
        date_from: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_to: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      thisWeek: {
        label: '本週',
        date_from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        date_to: now.toISOString().split('T')[0],
      },
      thisMonth: {
        label: '本月',
        date_from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
        date_to: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
      },
      lastMonth: {
        label: '上月',
        date_from: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0],
        date_to: new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0],
      },
      thisQuarter: {
        label: '本季度',
        date_from: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1).toISOString().split('T')[0],
        date_to: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0).toISOString().split('T')[0],
      },
      thisYear: {
        label: '本年',
        date_from: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
        date_to: new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0],
      },
      lastYear: {
        label: '去年',
        date_from: new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0],
        date_to: new Date(now.getFullYear() - 1, 11, 31).toISOString().split('T')[0],
      },
    };
  }

  // 格式化貨幣值
  static formatCurrency(value: number, currency: string): string {
    const formatter = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return formatter.format(value);
  }

  // 格式化百分比
  static formatPercentage(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
  }

  // 獲取趨勢指標（與上期比較）
  static calculateTrend(current: number, previous: number): {
    value: number;
    percentage: number;
    isPositive: boolean;
  } {
    if (previous === 0) {
      return { value: current, percentage: 100, isPositive: current > 0 };
    }

    const difference = current - previous;
    const percentage = (difference / previous) * 100;

    return {
      value: difference,
      percentage: Math.abs(percentage),
      isPositive: percentage >= 0,
    };
  }
}

export default DashboardService;
