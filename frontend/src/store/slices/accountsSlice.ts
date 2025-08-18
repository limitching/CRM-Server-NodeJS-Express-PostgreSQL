import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Account } from '../../types';

// Account state interface
interface AccountsState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    industry: string;
    status: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sortBy: {
    field: keyof Account;
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: AccountsState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    industry: '',
    status: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  sortBy: {
    field: 'company_name',
    direction: 'asc',
  },
};

// Async thunks
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _params: {
    page?: number;
    pageSize?: number;
    search?: string;
    industry?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await accountsService.getAccounts(params);
      // return response.data;
      
      // Mock response for now
      return {
        accounts: [
          {
            id: 1,
            company_name: 'TechCorp Inc.',
            industry: 'Technology',
            status: 'Active',
            contacts: [],
            opportunities: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            company_name: 'Global Solutions Ltd.',
            industry: 'Consulting',
            status: 'Active',
            contacts: [],
            opportunities: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 2,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch accounts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createAccount = createAsyncThunk(
  'accounts/createAccount',
  async (accountData: Omit<Account, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await accountsService.createAccount(accountData);
      // return response.data;
      
      // Mock response for now
      return {
        ...accountData,
        id: Date.now(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async (accountData: Partial<Account> & { id: number }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await accountsService.updateAccount(accountData);
      // return response.data;
      
      // Mock response for now
      return {
        ...accountData,
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update account';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (accountId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // await accountsService.deleteAccount(accountId);
      return accountId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setSelectedAccount: (state, action: PayloadAction<Account | null>) => {
      state.selectedAccount = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<AccountsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<AccountsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<{ field: keyof Account; direction: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        industry: '',
        status: '',
      };
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch accounts
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload.accounts;
        state.pagination.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create account
    builder
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accounts.unshift(action.payload);
        state.pagination.total += 1;
        state.selectedAccount = action.payload;
      });

    // Update account
    builder
      .addCase(updateAccount.fulfilled, (state, action) => {
        const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
        if (index !== -1) {
          state.accounts[index] = { ...state.accounts[index], ...action.payload };
        }
        if (state.selectedAccount?.id === action.payload.id) {
          state.selectedAccount = { ...state.selectedAccount, ...action.payload };
        }
      });

    // Delete account
    builder
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedAccount?.id === action.payload) {
          state.selectedAccount = null;
        }
      });
  },
});

// Export actions
export const {
  setSelectedAccount,
  setFilters,
  setPagination,
  setSortBy,
  clearFilters,
  clearError,
} = accountsSlice.actions;

// Export reducer
export default accountsSlice.reducer;
