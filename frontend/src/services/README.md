# API服務層 (API Service Layer)

## 概述

API服務層是前端與後端REST API進行通信的統一接口層。它提供了類型安全的API調用、錯誤處理、響應格式化等功能。

## 架構

```
services/
├── apiClient.ts          # 基礎API客戶端
├── authService.ts        # 認證服務
├── dashboardService.ts   # 儀表板服務
├── accountService.ts     # 帳戶管理服務
├── contactService.ts     # 聯繫人管理服務
├── opportunityService.ts # 機會管理服務
├── userService.ts        # 用戶管理服務
├── systemService.ts      # 系統配置服務
├── reminderService.ts    # 提醒服務
└── index.ts             # 服務導出索引
```

## 核心組件

### 1. 基礎API客戶端 (apiClient.ts)

提供統一的HTTP請求處理，包括：
- 請求/響應攔截器
- 認證token管理
- 錯誤處理
- 請求重試機制
- 文件上傳支持

```typescript
import { apiClient } from './services';

// GET請求
const response = await apiClient.get<User[]>('/users');

// POST請求
const response = await apiClient.post<User>('/users', userData);

// 文件上傳
const response = await apiClient.upload<{url: string}>('/upload', file);
```

### 2. 服務類

每個業務領域都有對應的服務類，提供：
- CRUD操作
- 數據驗證
- 搜索和過濾
- 統計分析
- 數據導入/導出

## 使用示例

### 儀表板服務

```typescript
import { DashboardService } from './services';

// 獲取基礎指標
const metrics = await DashboardService.getBasicMetrics({
  date_from: '2024-01-01',
  date_to: '2024-12-31',
  currency: 'USD',
  showBy: 'User'
});

// 獲取高級指標
const advancedMetrics = await DashboardService.getAdvancedMetrics({
  date_from: '2024-01-01',
  date_to: '2024-12-31',
  currency: 'ALL',
  showBy: 'Company',
  by: 'Status'
});
```

### 帳戶管理服務

```typescript
import { AccountService } from './services';

// 獲取所有帳戶
const accounts = await AccountService.getAll();

// 搜索帳戶
const searchResults = await AccountService.search('科技公司', {
  industry: ['Technology', 'Software'],
  status: ['Active']
});

// 創建新帳戶
const newAccount = await AccountService.create({
  company_name: '新科技有限公司',
  industry: 'Technology',
  status: 'Active'
});

// 上傳文檔
const uploadResult = await AccountService.uploadDocument(accountId, file);
```

### 聯繫人管理服務

```typescript
import { ContactService } from './services';

// 獲取聯繫人統計
const stats = await ContactService.getStats();

// 根據帳戶獲取聯繫人
const contacts = await ContactService.getByAccount(accountId);

// 導入聯繫人
const importResult = await ContactService.importContacts(file);
```

### 機會管理服務

```typescript
import { OpportunityService } from './services';

// 獲取管道視圖
const pipeline = await OpportunityService.getPipelineView();

// 重新排序機會
await OpportunityService.reorder([
  { id: 1, status_id: 2, order: 1 },
  { id: 2, status_id: 2, order: 2 }
]);

// 批量歸檔
await OpportunityService.archiveMultiple(opportunities);
```

### 用戶管理服務

```typescript
import { UserService } from './services';

// 檢查權限
const hasAdminPermission = UserService.hasPermission(user, 'administration');

// 激活/停用用戶
await UserService.activateUser(userId);
await UserService.deactivateUser(userId);

// 上傳頭像
const avatarResult = await UserService.uploadAvatar(file);
```

### 系統配置服務

```typescript
import { SystemService } from './services';

// 獲取部門層級結構
const hierarchy = await SystemService.getDepartmentHierarchy();

// 重新排序狀態
await SystemService.reorderStatuses(statuses);

// 導出系統配置
SystemService.exportSystemConfig('json');
```

### 提醒服務

```typescript
import { ReminderService } from './services';

// 獲取過期提醒
const overdue = await ReminderService.getOverdue();

// 獲取即將到期的提醒
const upcoming = await ReminderService.getUpcoming(7);

// 標記為完成
await ReminderService.markAsCompleted(reminderId);
```

## 錯誤處理

所有服務都提供統一的錯誤處理：

```typescript
try {
  const accounts = await AccountService.getAll();
} catch (error) {
  if (error.message.includes('Unauthorized')) {
    // 處理認證錯誤
  } else if (error.message.includes('Validation')) {
    // 處理驗證錯誤
  } else {
    // 處理其他錯誤
    console.error('API Error:', error);
  }
}
```

## 數據驗證

服務類提供內建的數據驗證：

```typescript
// 驗證帳戶數據
const validation = AccountService.validateAccountData(accountData);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}

// 創建帳戶
const account = await AccountService.create(accountData);
```

## 數據導入/導出

支持多種格式的數據導入/導出：

```typescript
// 導出為CSV
AccountService.exportAccounts(accounts, 'csv');

// 導出為JSON
AccountService.exportAccounts(accounts, 'json');

// 導入數據
const result = await AccountService.importAccounts(file);
console.log(`Imported: ${result.success}, Failed: ${result.failed}`);
```

## 批量操作

支持批量操作以提高效率：

```typescript
// 批量刪除
await AccountService.deleteMultiple([1, 2, 3]);

// 批量更新
const updatePromises = accounts.map(account => 
  AccountService.update(account.id, { status: 'Active' })
);
await Promise.all(updatePromises);
```

## 服務工廠

使用服務工廠來獲取服務實例：

```typescript
import ServiceFactory from './services';

const accountService = ServiceFactory.getAccountService();
const contactService = ServiceFactory.getContactService();
```

## 最佳實踐

1. **錯誤處理**: 始終使用try-catch包裝API調用
2. **數據驗證**: 在發送請求前驗證數據
3. **類型安全**: 使用TypeScript類型定義確保類型安全
4. **批量操作**: 對於大量數據操作使用批量API
5. **緩存策略**: 實現適當的數據緩存策略
6. **用戶反饋**: 提供清晰的加載狀態和錯誤提示

## 擴展

要添加新的服務：

1. 創建新的服務文件 (如 `newService.ts`)
2. 實現服務類和相關接口
3. 在 `index.ts` 中導出
4. 更新類型定義
5. 添加單元測試

## 測試

每個服務都應該有對應的單元測試：

```typescript
// 測試示例
describe('AccountService', () => {
  it('should create account successfully', async () => {
    const mockData = { company_name: 'Test Company' };
    const result = await AccountService.create(mockData);
    expect(result.company_name).toBe('Test Company');
  });
});
```
