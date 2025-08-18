import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';


// Dashboard metrics interface
interface DashboardMetrics {
  totalCustomers: number;
  totalOpportunities: number;
  totalRevenue: {
    USD: number;
    EUR: number;
  };
  opportunitiesByStatus: Record<string, number>;
  opportunitiesByUser: Record<string, number>;
  opportunitiesByMonth: Record<string, number>;
  opportunitiesByYear: Record<string, number>;
  currencyDistribution: {
    USD: number;
    EUR: number;
  };
}

// Recent activity interface
interface RecentActivity {
  id: string;
  type: 'account' | 'contact' | 'opportunity' | 'user' | 'system';
  action: string;
  description: string;
  timestamp: Date;
  userId: number;
  userName: string;
  relatedId?: number;
  relatedType?: string;
}

// Dashboard state interface
interface DashboardState {
  metrics: DashboardMetrics | null;
  recentActivities: RecentActivity[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  selectedDateRange: {
    start: Date;
    end: Date;
  };
  selectedCurrency: 'USD' | 'EUR';
  refreshInterval: number;
}

// Initial state
const initialState: DashboardState = {
  metrics: null,
  recentActivities: [],
  loading: false,
  error: null,
  lastUpdated: null,
  selectedDateRange: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  },
  selectedCurrency: 'USD',
  refreshInterval: 300000, // 5 minutes
};

// Async thunks
export const fetchDashboardMetrics = createAsyncThunk(
  'dashboard/fetchMetrics',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_params: { dateRange?: { start: Date; end: Date }; currency?: 'USD' | 'EUR' } = {}, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await dashboardService.getMetrics(params);
      // return response.data;
      
      // Mock response for now
      return {
        totalCustomers: 150,
        totalOpportunities: 45,
        totalRevenue: {
          USD: 1250000,
          EUR: 1100000,
        },
        opportunitiesByStatus: {
          'Prospecting': 12,
          'Qualification': 8,
          'Proposal': 15,
          'Negotiation': 6,
          'Closed Won': 4,
        },
        opportunitiesByUser: {
          'John Doe': 15,
          'Jane Smith': 20,
          'Bob Johnson': 10,
        },
        opportunitiesByMonth: {
          'Jan': 8,
          'Feb': 12,
          'Mar': 15,
          'Apr': 10,
        },
        opportunitiesByYear: {
          '2023': 120,
          '2024': 45,
        },
        currencyDistribution: {
          USD: 65,
          EUR: 35,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard metrics';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_limit: number = 10, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await dashboardService.getRecentActivities(limit);
      // return response.data;
      
      // Mock response for now
      return [
        {
          id: '1',
          type: 'opportunity' as const,
          action: 'Created',
          description: 'New opportunity "Enterprise Software License" created',
          timestamp: new Date(),
          userId: 1,
          userName: 'John Doe',
          relatedId: 123,
          relatedType: 'opportunity',
        },
        {
          id: '2',
          type: 'account' as const,
          action: 'Updated',
          description: 'Account "TechCorp Inc." information updated',
          timestamp: new Date(Date.now() - 3600000),
          userId: 2,
          userName: 'Jane Smith',
          relatedId: 456,
          relatedType: 'account',
        },
      ];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recent activities';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ start: Date; end: Date }>) => {
      state.selectedDateRange = action.payload;
    },
    setCurrency: (state, action: PayloadAction<'USD' | 'EUR'>) => {
      state.selectedCurrency = action.payload;
    },
    setRefreshInterval: (state, action: PayloadAction<number>) => {
      state.refreshInterval = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    addActivity: (state, action: PayloadAction<RecentActivity>) => {
      state.recentActivities.unshift(action.payload);
      // Keep only last 50 activities
      if (state.recentActivities.length > 50) {
        state.recentActivities = state.recentActivities.slice(0, 50);
      }
    },
    updateMetrics: (state, action: PayloadAction<Partial<DashboardMetrics>>) => {
      if (state.metrics) {
        state.metrics = { ...state.metrics, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch metrics
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date();
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch recent activities
    builder
      .addCase(fetchRecentActivities.pending, () => {
        // Don't set loading to true for activities to avoid blocking UI
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setDateRange,
  setCurrency,
  setRefreshInterval,
  clearError,
  addActivity,
  updateMetrics,
} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;
