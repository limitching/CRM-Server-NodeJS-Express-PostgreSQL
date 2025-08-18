import { ENV_CONFIG } from '../config/env';

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV_CONFIG.API_BASE_URL,
  TIMEOUT: ENV_CONFIG.API_TIMEOUT,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REGISTER: '/user/register',
      ACTIVATE: '/user/activate-account',
      RESET_PASSWORD: '/user/reset-password',
    },
    DASHBOARD: {
      CALCULATE: '/rest/dashboard/calculate',
      CALCULATE_V2: '/rest/dashboard/calculate/v2',
    },
    ACCOUNTS: {
      ALL: '/rest/account/all',
      SAVE: '/rest/account/save',
      REMOVE: '/rest/account/remove',
      UPLOAD: '/rest/account/upload',
    },
    CONTACTS: {
      ALL: '/rest/contact/all',
      SAVE: '/rest/contact/save',
      REMOVE: '/rest/contact/remove',
    },
    OPPORTUNITIES: {
      ALL: '/rest/opportunity/all',
      SAVE: '/rest/opportunity/save',
      REMOVE: '/rest/opportunity/remove',
      REORDER: '/rest/opportunity/reorder',
      ARCHIVE_ALL: '/rest/opportunity/archiveAll',
    },
    USERS: {
      ALL: '/rest/administration/user/all',
      SAVE: '/rest/administration/user/save',
      REMOVE: '/rest/administration/user/remove',
      UPDATE: '/rest/user/update',
      AVATAR: '/rest/user/avatar',
    },
    ROLES: {
      ALL: '/rest/role/all',
      SAVE: '/rest/role/save',
      REMOVE: '/rest/role/remove',
    },
    STATUS: {
      ALL: '/rest/status/all',
      SAVE: '/rest/status/save',
      REMOVE: '/rest/status/remove',
      REORDER: '/rest/status/reorder',
    },
    DEPARTMENTS: {
      ALL: '/rest/department/all',
      SAVE: '/rest/department/save',
      REMOVE: '/rest/department/remove',
    },
    REMINDERS: {
      ALL: '/rest/reminder/all',
      SAVE: '/rest/reminder/save',
      REMOVE: '/rest/reminder/remove',
    },
    SOCIAL_NETWORKS: {
      ALL: '/rest/socialNetwork/all',
      SAVE: '/rest/socialNetwork/save',
      REMOVE: '/rest/socialNetwork/remove',
    },
  },
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  ACTIVATE_ACCOUNT: '/activate-account',
  LANDING: '/landing',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  CONTACTS: '/contacts',
  OPPORTUNITIES: '/opportunities',
  USERS: '/users',
  SETTINGS: '/settings',
  REMINDERS: '/reminders',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

// Currency Options
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
} as const;

// Priority Levels
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  COMPANY_NAME_MIN_LENGTH: 2,
} as const;
