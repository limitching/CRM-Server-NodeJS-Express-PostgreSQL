// 儀表板相關類型定義

// 基礎儀表板指標
export interface DashboardMetrics {
  totalOpportunities: number;
  totalValue: number;
  currency: string;
  userMetrics: UserMetrics[];
  companyMetrics: CompanyMetrics[];
  statusMetrics: StatusMetrics[];
  monthMetrics: OpportunityMetrics[];
  yearMetrics: OpportunityMetrics[];
  currencyMetrics: OpportunityMetrics[];
  lastUpdated: Date;
}

// 儀表板計算參數
export interface DashboardCalculationParams {
  date_from: string;
  date_to: string;
  currency: 'ALL' | 'USD' | 'EUR';
  showBy: 'User' | 'Company' | 'Status' | 'Month' | 'Year' | 'Currency';
  value?: string;
  by?: 'User' | 'Company' | 'Status' | 'Month' | 'Year' | 'Currency';
}

// 儀表板計算結果
export interface DashboardCalculationResult {
  totalOpportunities?: number;
  totalValue?: number;
  currency?: string;
  userMetrics?: UserMetrics[];
  companyMetrics?: CompanyMetrics[];
  statusMetrics?: StatusMetrics[];
  monthMetrics?: OpportunityMetrics[];
  yearMetrics?: OpportunityMetrics[];
  currencyMetrics?: OpportunityMetrics[];
}

// 用戶指標
export interface UserMetrics {
  user_id: number;
  user_name: string;
  opportunities: number;
  value: number;
  currency: string;
}

// 公司指標
export interface CompanyMetrics {
  company_id: number;
  company_name: string;
  opportunities: number;
  value: number;
  currency: string;
}

// 狀態指標
export interface StatusMetrics {
  status_id: number;
  status_name: string;
  opportunities: number;
  value: number;
  currency: string;
}

// 機會指標
export interface OpportunityMetrics {
  period: string;
  opportunities: number;
  value: number;
  currency: string;
}

// 儀表板圖表數據
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

// 儀表板小部件配置
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'table';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: {
    x: number;
    y: number;
  };
  config: WidgetConfig;
}

export interface WidgetConfig {
  metricType?: string;
  chartType?: 'bar' | 'line' | 'pie' | 'doughnut';
  dataSource?: string;
  refreshInterval?: number;
  filters?: Record<string, unknown>;
}

// 儀表板佈局配置
export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  columns: number;
  rows: number;
  isDefault: boolean;
}

// 儀表板過濾器
export interface DashboardFilters {
  dateRange: {
    from: string;
    to: string;
  };
  currency: 'ALL' | 'USD' | 'EUR';
  users: number[];
  companies: number[];
  statuses: number[];
}

// 儀表板導出選項
export interface DashboardExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'image';
  includeCharts: boolean;
  includeTables: boolean;
  pageSize: 'A4' | 'Letter' | 'Legal';
  orientation: 'portrait' | 'landscape';
}
