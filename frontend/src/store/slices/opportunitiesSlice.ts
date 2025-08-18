import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Opportunity } from '../../types';

// Opportunity state interface
interface OpportunitiesState {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    user: string;
    company: string;
    currency: 'USD' | 'EUR';
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sortBy: {
    field: keyof Opportunity;
    direction: 'asc' | 'desc';
  };
  pipelineView: {
    stages: string[];
    opportunitiesByStage: Record<string, Opportunity[]>;
  };
}

// Initial state
const initialState: OpportunitiesState = {
  opportunities: [],
  selectedOpportunity: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    user: '',
    company: '',
    currency: 'USD',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  sortBy: {
    field: 'name',
    direction: 'asc',
  },
  pipelineView: {
    stages: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    opportunitiesByStage: {},
  },
};

// Async thunks
export const fetchOpportunities = createAsyncThunk(
  'opportunities/fetchOpportunities',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    user?: string;
    company?: string;
    currency?: 'USD' | 'EUR';
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await opportunitiesService.getOpportunities(params);
      // return response.data;
      
      // Mock response for now
      return {
        opportunities: [
          {
            id: 1,
            name: 'Enterprise Software License',
            value: 50000,
            currency: 'USD' as const,
            probability: 75,
            status_id: 1,
            user_id: 1,
            company_id: 1,
            expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            order: 1,
            is_active: true,
            notify_users: '1,2',
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            name: 'Consulting Services',
            value: 25000,
            currency: 'EUR' as const,
            probability: 60,
            status_id: 2,
            user_id: 2,
            company_id: 2,
            expected_close_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            order: 2,
            is_active: true,
            notify_users: '2,3',
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 2,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch opportunities';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createOpportunity = createAsyncThunk(
  'opportunities/createOpportunity',
  async (opportunityData: Omit<Opportunity, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await opportunitiesService.createOpportunity(opportunityData);
      // return response.data;
      
      // Mock response for now
      return {
        ...opportunityData,
        id: Date.now(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create opportunity';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  'opportunities/updateOpportunity',
  async (opportunityData: Partial<Opportunity> & { id: number }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await opportunitiesService.updateOpportunity(opportunityData);
      // return response.data;
      
      // Mock response for now
      return {
        ...opportunityData,
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update opportunity';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteOpportunity = createAsyncThunk(
  'opportunities/deleteOpportunity',
  async (opportunityId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // await opportunitiesService.deleteOpportunity(opportunityId);
      return opportunityId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete opportunity';
      return rejectWithValue(errorMessage);
    }
  }
);

export const reorderOpportunities = createAsyncThunk(
  'opportunities/reorderOpportunities',
  async (reorderData: { opportunityId: number; newOrder: number; newStatusId?: number }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await opportunitiesService.reorderOpportunities(reorderData);
      // return response.data;
      
      return reorderData;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder opportunities';
      return rejectWithValue(errorMessage);
    }
  }
);

export const archiveOpportunities = createAsyncThunk(
  'opportunities/archiveOpportunities',
  async (opportunityIds: number[], { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // await opportunitiesService.archiveOpportunities(opportunityIds);
      return opportunityIds;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to archive opportunities';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const opportunitiesSlice = createSlice({
  name: 'opportunities',
  initialState,
  reducers: {
    setSelectedOpportunity: (state, action: PayloadAction<Opportunity | null>) => {
      state.selectedOpportunity = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<OpportunitiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<OpportunitiesState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<{ field: keyof Opportunity; direction: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        user: '',
        company: '',
        currency: 'USD',
      };
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
    updatePipelineView: (state, action: PayloadAction<{ stages: string[]; opportunitiesByStage: Record<string, Opportunity[]> }>) => {
      state.pipelineView = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch opportunities
    builder
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        state.opportunities = action.payload.opportunities;
        state.pagination.total = action.payload.total;
        state.error = null;
        
        // Update pipeline view
        const opportunitiesByStage: Record<string, Opportunity[]> = {};
        state.pipelineView.stages.forEach(stage => {
          opportunitiesByStage[stage] = [];
        });
        
        action.payload.opportunities.forEach(opportunity => {
          // This would need to map status_id to stage name
          // For now, just add to first stage
          if (opportunitiesByStage[state.pipelineView.stages[0]]) {
            opportunitiesByStage[state.pipelineView.stages[0]].push(opportunity);
          }
        });
        
        state.pipelineView.opportunitiesByStage = opportunitiesByStage;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create opportunity
    builder
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.unshift(action.payload);
        state.pagination.total += 1;
        state.selectedOpportunity = action.payload;
      });

    // Update opportunity
    builder
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const index = state.opportunities.findIndex(opp => opp.id === action.payload.id);
        if (index !== -1) {
          state.opportunities[index] = { ...state.opportunities[index], ...action.payload };
        }
        if (state.selectedOpportunity?.id === action.payload.id) {
          state.selectedOpportunity = { ...state.selectedOpportunity, ...action.payload };
        }
      });

    // Delete opportunity
    builder
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(opp => opp.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedOpportunity?.id === action.payload) {
          state.selectedOpportunity = null;
        }
      });

    // Reorder opportunities
    builder
      .addCase(reorderOpportunities.fulfilled, (state, action) => {
        const { opportunityId, newOrder, newStatusId } = action.payload;
        const opportunity = state.opportunities.find(opp => opp.id === opportunityId);
        if (opportunity) {
          opportunity.order = newOrder;
          if (newStatusId) {
            opportunity.status_id = newStatusId;
          }
        }
      });

    // Archive opportunities
    builder
      .addCase(archiveOpportunities.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(opp => !action.payload.includes(opp.id));
        state.pagination.total -= action.payload.length;
        if (state.selectedOpportunity && action.payload.includes(state.selectedOpportunity.id)) {
          state.selectedOpportunity = null;
        }
      });
  },
});

// Export actions
export const {
  setSelectedOpportunity,
  setFilters,
  setPagination,
  setSortBy,
  clearFilters,
  clearError,
  updatePipelineView,
} = opportunitiesSlice.actions;

// Export reducer
export default opportunitiesSlice.reducer;
