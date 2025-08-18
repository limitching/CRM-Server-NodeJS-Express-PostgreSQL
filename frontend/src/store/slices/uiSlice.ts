import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { THEME } from '../../constants';

// UI State interface
interface UIState {
  theme: string;
  language: string;
  sidebarCollapsed: boolean;
  notifications: NotificationItem[];
  modals: ModalState;
  loading: {
    global: boolean;
    page: boolean;
  };
  breadcrumbs: BreadcrumbItem[];
  searchQuery: string;
  filters: Record<string, unknown>;
}

// Notification item interface
interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Modal state interface
interface ModalState {
  [key: string]: {
    open: boolean;
    data?: unknown;
  };
}

// Breadcrumb item interface
interface BreadcrumbItem {
  label: string;
  path: string;
  active: boolean;
}

// Initial state
const initialState: UIState = {
  theme: THEME.LIGHT,
  language: 'en',
  sidebarCollapsed: false,
  notifications: [],
  modals: {},
  loading: {
    global: false,
    page: false,
  },
  breadcrumbs: [],
  searchQuery: '',
  filters: {},
};

// Create slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme management
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT;
    },

    // Language management
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    // Sidebar management
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    // Notification management
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>) => {
      const notification: NotificationItem = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal management
    openModal: (state, action: PayloadAction<{ key: string; data?: unknown }>) => {
      state.modals[action.payload.key] = {
        open: true,
        data: action.payload.data,
      };
    },
    closeModal: (state, action: PayloadAction<string>) => {
      if (state.modals[action.payload]) {
        state.modals[action.payload].open = false;
        state.modals[action.payload].data = undefined;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        if (state.modals[key]) {
          state.modals[key] = { open: false, data: undefined };
        }
      });
    },

    // Loading management
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },

    // Breadcrumb management
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<BreadcrumbItem>) => {
      state.breadcrumbs.push(action.payload);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },

    // Search and filters
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: unknown }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload];
    },
    clearAllFilters: (state) => {
      state.filters = {};
    },

    // Reset UI state
    resetUI: (state) => {
      state.notifications = [];
      state.modals = {};
      state.loading = { global: false, page: false };
      state.breadcrumbs = [];
      state.searchQuery = '';
      state.filters = {};
    },
  },
});

// Export actions
export const {
  setTheme,
  toggleTheme,
  setLanguage,
  toggleSidebar,
  setSidebarCollapsed,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setPageLoading,
  setBreadcrumbs,
  addBreadcrumb,
  clearBreadcrumbs,
  setSearchQuery,
  setFilter,
  clearFilter,
  clearAllFilters,
  resetUI,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
