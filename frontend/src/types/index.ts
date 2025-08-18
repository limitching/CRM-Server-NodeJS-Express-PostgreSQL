// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  active: boolean;
  roles: Role[];
  avatar?: string;
  expires?: Date;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

// Account Types
export interface Account {
  id: number;
  company_name: string;
  industry?: string;
  status?: string;
  contacts: Contact[];
  opportunities: Opportunity[];
  created_at: Date;
  updated_at: Date;
}

// Contact Types
export interface Contact {
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

// Opportunity Types
export interface Opportunity {
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

// Status Types
export interface Status {
  id: number;
  name: string;
  order: number;
}

// Department Types
export interface Department {
  id: number;
  name: string;
  description?: string;
}

// Reminder Types
export interface Reminder {
  id: number;
  title: string;
  description?: string;
  due_date: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  user_id: number;
  created_at: Date;
  updated_at: Date;
}
