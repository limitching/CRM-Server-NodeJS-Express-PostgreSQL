# Redux Store Structure

## Overview

This directory contains the Redux store configuration and all related slices for the CRM frontend application. The store is built using Redux Toolkit and includes persistence for authentication and UI state.

## Store Configuration

### Main Store (`index.ts`)
- **Redux Toolkit**: Configured with middleware and DevTools
- **Redux Persist**: Persists auth and UI state to localStorage
- **DevTools**: Enabled in development mode with custom configuration

### Store Structure
```typescript
{
  auth: AuthState,           // User authentication state
  ui: UIState,               // Global UI state (theme, notifications, etc.)
  dashboard: DashboardState, // Dashboard metrics and activities
  accounts: AccountsState,   // Customer accounts management
  contacts: ContactsState,   // Contact management
  opportunities: OpportunitiesState, // Sales pipeline management
  users: UsersState,         // User administration
}
```

## Slices

### 1. Auth Slice (`slices/authSlice.ts`)
**Purpose**: Manages user authentication state
**Features**:
- Login/logout functionality
- User registration
- Password reset
- Account activation
- Profile updates
- Token management

**State**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  rememberMe: boolean;
  // Loading states for different operations
  loginLoading: boolean;
  registerLoading: boolean;
  resetPasswordLoading: boolean;
  activateAccountLoading: boolean;
  profileUpdateLoading: boolean;
}
```

### 2. UI Slice (`slices/uiSlice.ts`)
**Purpose**: Manages global UI state
**Features**:
- Theme management (light/dark)
- Language settings
- Sidebar state
- Notifications system
- Modal management
- Loading states
- Breadcrumbs
- Search and filters

**State**:
```typescript
interface UIState {
  theme: string;
  language: string;
  sidebarCollapsed: boolean;
  notifications: NotificationItem[];
  modals: ModalState;
  loading: { global: boolean; page: boolean };
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  filters: Record<string, unknown>;
}
```

### 3. Dashboard Slice (`slices/dashboardSlice.ts`)
**Purpose**: Manages dashboard data and metrics
**Features**:
- KPI metrics (customers, opportunities, revenue)
- Chart data by various dimensions
- Recent activities
- Date range filtering
- Currency selection
- Real-time updates

**State**:
```typescript
interface DashboardState {
  metrics: DashboardMetrics | null;
  recentActivities: RecentActivity[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectedDateRange: { start: Date; end: Date };
  selectedCurrency: 'USD' | 'EUR';
  refreshInterval: number;
}
```

### 4. Accounts Slice (`slices/accountsSlice.ts`)
**Purpose**: Manages customer accounts
**Features**:
- CRUD operations for accounts
- Search and filtering
- Pagination
- Sorting
- Bulk operations

**State**:
```typescript
interface AccountsState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
  filters: { search: string; industry: string; status: string };
  pagination: { page: number; pageSize: number; total: number };
  sortBy: { field: keyof Account; direction: 'asc' | 'desc' };
}
```

### 5. Contacts Slice (`slices/contactsSlice.ts`)
**Purpose**: Manages contact information
**Features**:
- CRUD operations for contacts
- Search and filtering
- Pagination
- Sorting
- Account associations

**State**:
```typescript
interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string | null;
  filters: { search: string; status: string; company: string };
  pagination: { page: number; pageSize: number; total: number };
  sortBy: { field: keyof Contact; direction: 'asc' | 'desc' };
}
```

### 6. Opportunities Slice (`slices/opportunitiesSlice.ts`)
**Purpose**: Manages sales opportunities and pipeline
**Features**:
- CRUD operations for opportunities
- Pipeline view with stages
- Drag and drop reordering
- Status progression tracking
- Search and filtering
- Bulk operations

**State**:
```typescript
interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  filters: { search: string; status: string; user: string; company: string; currency: 'USD' | 'EUR' };
  pagination: { page: number; pageSize: number; total: number };
  sortBy: { field: keyof Opportunity; direction: 'asc' | 'desc' };
  pipelineView: { stages: string[]; opportunitiesByStage: Record<string, Opportunity[]> };
}
```

### 7. Users Slice (`slices/usersSlice.ts`)
**Purpose**: Manages user administration
**Features**:
- CRUD operations for users (admin only)
- Role management
- User activation/deactivation
- Permission management
- Search and filtering

**State**:
```typescript
interface UsersState {
  users: User[];
  selectedUser: User | null;
  roles: Role[];
  loading: boolean;
  error: string | null;
  filters: { search: string; role: string; status: string };
  pagination: { page: number; pageSize: number; total: number };
  sortBy: { field: keyof User; direction: 'asc' | 'desc' };
}
```

## Hooks (`hooks.ts`)

Provides type-safe Redux hooks:
- `useAppDispatch`: Typed dispatch function
- `useAppSelector`: Typed selector hook

## DevTools (`devTools.ts`)

Custom Redux DevTools configuration:
- Sanitizes sensitive data (tokens, credentials)
- Customizes DevTools appearance
- Enables/disables specific features

## Usage Examples

### Using Redux in Components
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  
  const handleLogin = (credentials) => {
    dispatch(loginUser(credentials));
  };
  
  // ... rest of component
};
```

### Accessing State
```typescript
// Get user from auth state
const user = useAppSelector(state => state.auth.user);

// Get dashboard metrics
const metrics = useAppSelector(state => state.dashboard.metrics);

// Get UI theme
const theme = useAppSelector(state => state.ui.theme);
```

### Dispatching Actions
```typescript
// Update UI theme
dispatch(setTheme('dark'));

// Toggle sidebar
dispatch(toggleSidebar());

// Add notification
dispatch(addNotification({
  type: 'success',
  title: 'Success',
  message: 'Operation completed successfully'
}));
```

## Persistence

- **Auth State**: Persists user, token, and authentication status
- **UI State**: Persists theme, language, and sidebar state
- **Other States**: Not persisted (reloaded from API on page refresh)

## Error Handling

All slices include error handling:
- Error states for failed operations
- Loading states for pending operations
- Error clearing actions
- Consistent error message format

## Performance Considerations

- Async thunks for API operations
- Optimistic updates where appropriate
- Selective state updates
- Efficient re-rendering with proper selectors
