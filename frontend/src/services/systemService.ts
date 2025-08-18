import { apiClient } from './apiClient';
import { API_CONFIG } from '../constants';
import type { Role, Status, Department, SocialNetwork } from '../types';

// 角色創建/更新請求接口
export interface RoleCreateRequest {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdateRequest extends RoleCreateRequest {
  id: number;
}

// 狀態創建/更新請求接口
export interface StatusCreateRequest {
  name: string;
  order: number;
  description?: string;
}

export interface StatusUpdateRequest extends StatusCreateRequest {
  id: number;
}

// 部門創建/更新請求接口
export interface DepartmentCreateRequest {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface DepartmentUpdateRequest extends DepartmentCreateRequest {
  id: number;
}

// 社交網絡創建/更新請求接口
export interface SocialNetworkCreateRequest {
  name: string;
  url?: string;
  description?: string;
}

export interface SocialNetworkUpdateRequest extends SocialNetworkCreateRequest {
  id: number;
}

// 系統配置服務類
export class SystemService {
  // ==================== 角色管理 ====================
  
  // 獲取所有角色
  static async getAllRoles(): Promise<Role[]> {
    try {
      const response = await apiClient.get<Role[]>(
        API_CONFIG.ENDPOINTS.ROLES.ALL
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
      throw error;
    }
  }

  // 創建新角色
  static async createRole(roleData: RoleCreateRequest): Promise<Role> {
    try {
      const response = await apiClient.post<Role>(
        API_CONFIG.ENDPOINTS.ROLES.SAVE,
        { object: roleData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create role:', error);
      throw error;
    }
  }

  // 更新角色
  static async updateRole(id: number, roleData: RoleUpdateRequest): Promise<Role> {
    try {
      const response = await apiClient.post<Role>(
        API_CONFIG.ENDPOINTS.ROLES.SAVE,
        { object: { ...roleData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update role ${id}:`, error);
      throw error;
    }
  }

  // 刪除角色
  static async deleteRole(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.ROLES.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete role ${id}:`, error);
      throw error;
    }
  }

  // ==================== 狀態管理 ====================
  
  // 獲取所有狀態
  static async getAllStatuses(): Promise<Status[]> {
    try {
      const response = await apiClient.get<Status[]>(
        API_CONFIG.ENDPOINTS.STATUS.ALL
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch statuses:', error);
      throw error;
    }
  }

  // 創建新狀態
  static async createStatus(statusData: StatusCreateRequest): Promise<Status> {
    try {
      const response = await apiClient.post<Status>(
        API_CONFIG.ENDPOINTS.STATUS.SAVE,
        { object: statusData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create status:', error);
      throw error;
    }
  }

  // 更新狀態
  static async updateStatus(id: number, statusData: StatusUpdateRequest): Promise<Status> {
    try {
      const response = await apiClient.post<Status>(
        API_CONFIG.ENDPOINTS.STATUS.SAVE,
        { object: { ...statusData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update status ${id}:`, error);
      throw error;
    }
  }

  // 刪除狀態
  static async deleteStatus(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.STATUS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete status ${id}:`, error);
      throw error;
    }
  }

  // 重新排序狀態
  static async reorderStatuses(statuses: Status[]): Promise<void> {
    try {
      const response = await apiClient.post<void>(
        API_CONFIG.ENDPOINTS.STATUS.REORDER,
        statuses
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to reorder statuses:', error);
      throw error;
    }
  }

  // ==================== 部門管理 ====================
  
  // 獲取所有部門
  static async getAllDepartments(): Promise<Department[]> {
    try {
      const response = await apiClient.get<Department[]>(
        API_CONFIG.ENDPOINTS.DEPARTMENTS.ALL
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      throw error;
    }
  }

  // 根據ID獲取部門
  static async getDepartmentById(id: number): Promise<Department> {
    try {
      const response = await apiClient.get<Department>(
        `${API_CONFIG.ENDPOINTS.DEPARTMENTS.ALL}/${id}`
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to fetch department ${id}:`, error);
      throw error;
    }
  }

  // 創建新部門
  static async createDepartment(departmentData: DepartmentCreateRequest): Promise<Department> {
    try {
      const response = await apiClient.post<Department>(
        API_CONFIG.ENDPOINTS.DEPARTMENTS.SAVE,
        { object: departmentData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create department:', error);
      throw error;
    }
  }

  // 更新部門
  static async updateDepartment(id: number, departmentData: DepartmentUpdateRequest): Promise<Department> {
    try {
      const response = await apiClient.post<Department>(
        API_CONFIG.ENDPOINTS.DEPARTMENTS.SAVE,
        { object: { ...departmentData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update department ${id}:`, error);
      throw error;
    }
  }

  // 刪除部門
  static async deleteDepartment(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.DEPARTMENTS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete department ${id}:`, error);
      throw error;
    }
  }

  // ==================== 社交網絡管理 ====================
  
  // 獲取所有社交網絡
  static async getAllSocialNetworks(): Promise<SocialNetwork[]> {
    try {
      const response = await apiClient.get<SocialNetwork[]>(
        API_CONFIG.ENDPOINTS.SOCIAL_NETWORKS.ALL
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to fetch social networks:', error);
      throw error;
    }
  }

  // 根據ID獲取社交網絡
  static async getSocialNetworkById(id: number): Promise<SocialNetwork> {
    try {
      const response = await apiClient.get<SocialNetwork>(
        `${API_CONFIG.ENDPOINTS.SOCIAL_NETWORKS.ALL}/${id}`
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to fetch social network ${id}:`, error);
      throw error;
    }
  }

  // 創建新社交網絡
  static async createSocialNetwork(socialNetworkData: SocialNetworkCreateRequest): Promise<SocialNetwork> {
    try {
      const response = await apiClient.post<SocialNetwork>(
        API_CONFIG.ENDPOINTS.SOCIAL_NETWORKS.SAVE,
        { object: socialNetworkData }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Failed to create social network:', error);
      throw error;
    }
  }

  // 更新社交網絡
  static async updateSocialNetwork(id: number, socialNetworkData: SocialNetworkUpdateRequest): Promise<SocialNetwork> {
    try {
      const response = await apiClient.post<SocialNetwork>(
        API_CONFIG.ENDPOINTS.SOCIAL_NETWORKS.SAVE,
        { object: { ...socialNetworkData, id } }
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to update social network ${id}:`, error);
      throw error;
    }
  }

  // 刪除社交網絡
  static async deleteSocialNetwork(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `${API_CONFIG.ENDPOINTS.SOCIAL_NETWORKS.REMOVE}/${id}`
      );

      if (!response.success) {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error(`Failed to delete social network ${id}:`, error);
      throw error;
    }
  }

  // ==================== 通用方法 ====================
  
  // 驗證角色數據
  static validateRoleData(data: RoleCreateRequest | RoleUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('角色名稱至少需要2個字符');
    }

    if (data.description && data.description.trim().length < 5) {
      errors.push('角色描述至少需要5個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 驗證狀態數據
  static validateStatusData(data: StatusCreateRequest | StatusUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('狀態名稱至少需要2個字符');
    }

    if (data.order < 0) {
      errors.push('狀態順序不能為負數');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 驗證部門數據
  static validateDepartmentData(data: DepartmentCreateRequest | DepartmentUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('部門名稱至少需要2個字符');
    }

    if (data.description && data.description.trim().length < 5) {
      errors.push('部門描述至少需要5個字符');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 驗證社交網絡數據
  static validateSocialNetworkData(data: SocialNetworkCreateRequest | SocialNetworkUpdateRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('社交網絡名稱至少需要2個字符');
    }

    if (data.url && !this.isValidUrl(data.url)) {
      errors.push('請輸入有效的URL地址');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 驗證URL格式
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // 獲取部門層級結構
  static async getDepartmentHierarchy(): Promise<Department[]> {
    try {
      const departments = await this.getAllDepartments();
      return this.buildHierarchy(departments);
    } catch (error) {
      console.error('Failed to get department hierarchy:', error);
      throw error;
    }
  }

  // 構建部門層級結構
  private static buildHierarchy(departments: Department[]): Department[] {
    const departmentMap = new Map<number, Department>();
    const rootDepartments: Department[] = [];

    // 創建映射
    departments.forEach(dept => {
      departmentMap.set(dept.id, { ...dept, children: [] });
    });

    // 構建層級關係
    departments.forEach(dept => {
      if (dept.parent_id) {
        const parent = departmentMap.get(dept.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(departmentMap.get(dept.id)!);
        }
      } else {
        rootDepartments.push(departmentMap.get(dept.id)!);
      }
    });

    return rootDepartments;
  }

  // 獲取狀態統計
  static async getStatusStats(): Promise<Record<string, number>> {
    try {
      const statuses = await this.getAllStatuses();
      const stats: Record<string, number> = {};

      statuses.forEach(status => {
        stats[status.name] = status.order;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get status stats:', error);
      throw error;
    }
  }

  // 導出系統配置數據
  static exportSystemConfig(format: 'csv' | 'json' = 'json'): void {
    if (format === 'csv') {
      this.exportToCSV();
    } else {
      this.exportToJSON();
    }
  }

  // 導出為CSV
  private static async exportToCSV(): Promise<void> {
    try {
      const [roles, statuses, departments, socialNetworks] = await Promise.all([
        this.getAllRoles(),
        this.getAllStatuses(),
        this.getAllDepartments(),
        this.getAllSocialNetworks(),
      ]);

      const csvContent = [
        '=== ROLES ===',
        'ID,Name,Description',
        ...roles.map(role => `${role.id},"${role.name}","${role.description || ''}"`),
        '',
        '=== STATUSES ===',
        'ID,Name,Order',
        ...statuses.map(status => `${status.id},"${status.name}",${status.order}`),
        '',
        '=== DEPARTMENTS ===',
        'ID,Name,Description,Parent ID',
        ...departments.map(dept => `${dept.id},"${dept.name}","${dept.description || ''}",${dept.parent_id || ''}`),
        '',
        '=== SOCIAL NETWORKS ===',
        'ID,Name,URL,Description',
        ...socialNetworks.map(sn => `${sn.id},"${sn.name}","${sn.url || ''}","${sn.description || ''}"`),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `system_config_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } catch (error) {
      console.error('Failed to export system config to CSV:', error);
    }
  }

  // 導出為JSON
  private static async exportToJSON(): Promise<void> {
    try {
      const [roles, statuses, departments, socialNetworks] = await Promise.all([
        this.getAllRoles(),
        this.getAllStatuses(),
        this.getAllDepartments(),
        this.getAllSocialNetworks(),
      ]);

      const config = {
        roles,
        statuses,
        departments,
        socialNetworks,
        exportedAt: new Date().toISOString(),
      };

      const jsonContent = JSON.stringify(config, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `system_config_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (error) {
      console.error('Failed to export system config to JSON:', error);
    }
  }
}

export default SystemService;
