# Frontend UI Design Document

## Overview

The frontend UI will be implemented as a modern, responsive single-page application (SPA) that integrates seamlessly with the existing CRM backend API. The interface will provide comprehensive CRM functionality including user management, customer accounts, contacts, opportunities, and analytics. The design follows modern UX principles with a focus on usability, accessibility, and responsive design.

The application will be built using React with TypeScript for type safety, and will communicate with the existing REST API endpoints that are already implemented in the backend.

## Architecture

### Technology Stack
- **Frontend Framework**: React 18+ with TypeScript
- **State Management**: Redux Toolkit for global state, React Query for server state
- **UI Library**: Material-UI (MUI) v5 for consistent design system
- **Routing**: React Router v6 for SPA navigation
- **HTTP Client**: Axios for API communication
- **Build Tool**: Vite for fast development and building
- **Testing**: Jest + React Testing Library
- **Styling**: CSS-in-JS with MUI's styled components

### Application Structure
```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, Footer)
│   └── features/       # Feature-specific components
├── pages/              # Page components for each route
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── assets/             # Static assets (images, icons)
```

### Component Hierarchy
```
App
├── AuthProvider        # Authentication context
├── Layout
│   ├── Header         # Navigation and user menu
│   ├── Sidebar        # Main navigation menu
│   └── MainContent    # Page content area
├── Routes
│   ├── Login          # Authentication page
│   ├── Dashboard      # Main dashboard
│   ├── Accounts       # Customer management
│   ├── Contacts       # Contact management
│   ├── Opportunities  # Sales pipeline
│   ├── Users          # User management
│   ├── Reports        # Analytics and reporting
│   └── Settings       # System configuration
└── GlobalComponents   # Notifications, modals, etc.
```

## Components and Interfaces

### 1. Authentication System
**Components**: `LoginPage`, `AuthProvider`, `ProtectedRoute`
**API Integration**: 
- POST `/login` - User authentication
- POST `/logout` - User logout
- POST `/user/register` - User registration
- POST `/user/activate-account` - Account activation
- POST `/user/reset-password` - Password reset

**Features**:
- JWT token-based authentication
- Session persistence across page refreshes
- Role-based access control
- Password strength validation
- Account activation flow

### 2. Dashboard
**Components**: `DashboardPage`, `MetricsCard`, `RecentActivityList`, `ChartWidget`
**API Integration**:
- POST `/rest/dashboard/calculate` - Basic dashboard metrics
- POST `/rest/dashboard/calculate/v2` - Advanced dashboard with multiple dimensions

**Features**:
- Key Performance Indicators (KPIs)
- Revenue metrics by currency (USD/EUR)
- Opportunities by user, company, status, month, year
- Interactive charts and graphs
- Date range filtering
- Real-time data updates

### 3. Account Management
**Components**: `AccountsPage`, `AccountList`, `AccountForm`, `AccountDetail`
**API Integration**:
- GET `/rest/account/all` - List all accounts
- POST `/rest/account/save` - Create/update account
- DELETE `/rest/account/remove` - Delete account
- POST `/rest/account/upload` - Upload account documents

**Features**:
- CRUD operations for customer accounts
- Search and filtering capabilities
- Bulk operations (import/export)
- Document upload to S3
- Associated contacts and opportunities display
- Account status management

### 4. Contact Management
**Components**: `ContactsPage`, `ContactList`, `ContactForm`, `ContactDetail`
**API Integration**:
- GET `/rest/contact/all` - List all contacts
- POST `/rest/contact/save` - Create/update contact
- DELETE `/rest/contact/remove` - Delete contact

**Features**:
- Personal and professional information management
- Contact-account associations
- Communication history tracking
- Bulk contact operations
- Advanced search and filtering
- Contact import/export functionality

### 5. Opportunity Management
**Components**: `OpportunitiesPage`, `PipelineView`, `OpportunityForm`, `OpportunityCard`
**API Integration**:
- GET `/rest/opportunity/all` - List all opportunities
- POST `/rest/opportunity/save` - Create/update opportunity
- DELETE `/rest/opportunity/remove` - Delete opportunity
- POST `/rest/opportunity/reorder` - Reorder opportunities
- POST `/rest/opportunity/archiveAll` - Archive opportunities

**Features**:
- Kanban-style pipeline view
- Drag-and-drop opportunity reordering
- Stage progression tracking
- Value and probability management
- Expected close date tracking
- User assignment and notifications
- Bulk archiving operations

### 6. User Management
**Components**: `UsersPage`, `UserList`, `UserForm`, `UserDetail`, `RoleManagement`
**API Integration**:
- POST `/rest/administration/user/all` - List all users (admin only)
- POST `/rest/administration/user/save` - Create/update user (admin only)
- POST `/rest/administration/user/remove` - Delete user (admin only)
- POST `/rest/user/update` - Update current user
- POST `/rest/user/avatar` - Upload user avatar

**Features**:
- User CRUD operations (admin only)
- Role and permission management
- Avatar upload to S3
- User activation/deactivation
- Password management
- Session management

### 7. System Configuration
**Components**: `SettingsPage`, `RoleForm`, `StatusForm`, `DepartmentForm`
**API Integration**:
- GET `/rest/role/all` - List all roles
- POST `/rest/role/save` - Create/update role
- DELETE `/rest/role/remove` - Delete role
- GET `/rest/status/all` - List all statuses
- POST `/rest/status/save` - Create/update status
- DELETE `/rest/status/remove` - Delete status
- GET `/rest/department/all` - List all departments
- POST `/rest/department/save` - Create/update department
- DELETE `/rest/department/remove` - Delete department

**Features**:
- Role definition and management
- Status configuration for opportunities
- Department organization structure
- Permission system configuration
- System-wide settings management

### 8. Reminder System
**Components**: `RemindersPage`, `ReminderList`, `ReminderForm`, `NotificationCenter`
**API Integration**:
- GET `/rest/reminder/all` - List all reminders
- POST `/rest/reminder/save` - Create/update reminder
- DELETE `/rest/reminder/remove` - Delete reminder

**Features**:
- Task and deadline management
- Priority-based organization
- Due date tracking
- Completion status management
- Notification system integration
- Calendar integration

## Data Models

### API Response Structure
Based on the existing backend implementation, the API responses follow this pattern:

```typescript
// Success Response
{
  success: boolean;
  message: string;
  data: any;
}

// Error Response
{
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
```

### Core Data Types
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  active: boolean;
  roles: Role[];
  avatar?: string;
  expires?: Date;
}

interface Account {
  id: number;
  company_name: string;
  industry?: string;
  status?: string;
  contacts: Contact[];
  opportunities: Opportunity[];
  created_at: Date;
  updated_at: Date;
}

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  position?: string;
  accounts: Account[];
  created_at: Date;
  updated_at: Date;
}

interface Opportunity {
  id: number;
  name: string;
  value: number;
  currency: 'USD' | 'EUR';
  probability: number;
  status_id: number;
  user_id: number;
  company_id: number;
  expected_close_date: Date;
  order: number;
  is_active: boolean;
  notify_users: string;
  created_at: Date;
  updated_at: Date;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

interface Status {
  id: number;
  name: string;
  order: number;
}
```

## User Interface Design

### Design System
- **Color Palette**: Professional CRM color scheme with primary, secondary, and accent colors
- **Typography**: Clear, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system for spacing
- **Components**: Material Design-inspired components with custom CRM styling
- **Icons**: Consistent icon set for navigation and actions

### Responsive Design
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Adapted layout with collapsible sidebar
- **Mobile**: Mobile-first design with bottom navigation
- **Breakpoints**: 768px, 1024px, 1440px

### Accessibility
- **WCAG 2.1 AA Compliance**: Full accessibility standards implementation
- **Keyboard Navigation**: Complete keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios for readability
- **Focus Management**: Clear focus indicators and logical tab order

## State Management

### Redux Store Structure
```typescript
interface RootState {
  auth: AuthState;
  dashboard: DashboardState;
  accounts: AccountsState;
  contacts: ContactsState;
  opportunities: OpportunitiesState;
  users: UsersState;
  ui: UIState;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### React Query Integration
- **Server State Management**: Automatic caching and synchronization
- **Background Updates**: Real-time data updates
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Centralized error management
- **Loading States**: Consistent loading indicators

## Security Considerations

### Authentication Security
- JWT token storage in secure HTTP-only cookies
- Automatic token refresh before expiration
- Secure logout with token invalidation
- Role-based access control enforcement
- Session timeout handling

### Data Security
- Input validation and sanitization
- XSS prevention measures
- CSRF protection
- Secure file upload handling
- API rate limiting compliance

## Performance Optimization

### Code Splitting
- Route-based code splitting
- Component lazy loading
- Dynamic imports for heavy components
- Bundle size optimization

### Caching Strategy
- API response caching with React Query
- Static asset caching
- Service worker for offline functionality
- Optimistic updates for better UX

### Performance Monitoring
- Core Web Vitals tracking
- Bundle size monitoring
- API response time tracking
- User interaction metrics

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing
- Redux store testing

### Integration Testing
- API integration testing
- User flow testing
- Cross-component interaction testing
- State management testing

### End-to-End Testing
- Complete user journey testing
- Cross-browser compatibility testing
- Responsive design testing
- Accessibility testing

## Deployment and DevOps

### Build Process
- Vite-based build system
- Environment-specific configurations
- Asset optimization and compression
- Source map generation for debugging

### Deployment
- Static file hosting (CDN)
- Environment variable management
- Health check endpoints
- Monitoring and logging integration

### CI/CD Pipeline
- Automated testing on pull requests
- Build and deployment automation
- Quality gate enforcement
- Rollback capabilities
