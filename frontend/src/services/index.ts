// API服務層索引文件
// 導出所有服務類和相關類型

// 基礎API客戶端
export { apiClient, ApiResponseWrapper } from './apiClient';
export type { 
  ApiResponse, 
  ApiError, 
  RequestConfig 
} from './apiClient';

// 儀表板服務
export { DashboardService } from './dashboardService';
export type { DashboardParams } from './dashboardService';

// 帳戶管理服務
export { AccountService } from './accountService';
export type { 
  AccountQueryParams, 
  AccountFilters, 
  AccountStats 
} from './accountService';

// 聯繫人管理服務
export { ContactService } from './contactService';
export type { 
  ContactQueryParams, 
  ContactFilters, 
  ContactStats 
} from './contactService';

// 機會管理服務
export { OpportunityService } from './opportunityService';
export type { 
  OpportunityQueryParams, 
  OpportunityFilters, 
  OpportunityStats,
  OpportunityReorderData 
} from './opportunityService';

// 用戶管理服務
export { UserService } from './userService';
export type { 
  UserQueryParams, 
  UserFilters, 
  UserStats 
} from './userService';

// 系統配置服務
export { SystemService } from './systemService';
export type { 
  RoleCreateRequest, 
  RoleUpdateRequest,
  StatusCreateRequest, 
  StatusUpdateRequest,
  DepartmentCreateRequest, 
  DepartmentUpdateRequest,
  SocialNetworkCreateRequest, 
  SocialNetworkUpdateRequest 
} from './systemService';

// 提醒服務
export { ReminderService } from './reminderService';
export type { 
  ReminderCreateRequest, 
  ReminderUpdateRequest,
  ReminderQueryParams, 
  ReminderFilters, 
  ReminderStats 
} from './reminderService';

// 認證服務（已存在的）
export { authService } from './authService';

// 明確導入服務類用於服務工廠
import { DashboardService } from './dashboardService';
import { AccountService } from './accountService';
import { ContactService } from './contactService';
import { OpportunityService } from './opportunityService';
import { UserService } from './userService';
import { SystemService } from './systemService';
import { ReminderService } from './reminderService';
import { authService } from './authService';

// 服務工廠 - 用於創建服務實例
export class ServiceFactory {
  static getDashboardService() {
    return DashboardService;
  }

  static getAccountService() {
    return AccountService;
  }

  static getContactService() {
    return ContactService;
  }

  static getOpportunityService() {
    return OpportunityService;
  }

  static getUserService() {
    return UserService;
  }

  static getSystemService() {
    return SystemService;
  }

  static getReminderService() {
    return ReminderService;
  }

  static getAuthService() {
    return authService;
  }
}

// 默認導出服務工廠
export default ServiceFactory;
