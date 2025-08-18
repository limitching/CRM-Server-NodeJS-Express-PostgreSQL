import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Role } from '../../types';

// User state interface
interface UsersState {
  users: User[];
  selectedUser: User | null;
  roles: Role[];
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    role: string;
    status: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sortBy: {
    field: keyof User;
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  roles: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    role: '',
    status: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  sortBy: {
    field: 'username',
    direction: 'asc',
  },
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_params: {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.getUsers(params);
      // return response.data;
      
      // Mock response for now
      return {
        users: [
          {
            id: 1,
            username: 'admin',
            email: 'admin@company.com',
            active: true,
            roles: [
              {
                id: 1,
                name: 'Administrator',
                permissions: [
                  { id: 1, name: 'user_management', description: 'Manage users' },
                  { id: 2, name: 'system_config', description: 'Configure system' },
                ],
              },
            ],
            avatar: undefined,
            expires: undefined,
          },
          {
            id: 2,
            username: 'manager',
            email: 'manager@company.com',
            active: true,
            roles: [
              {
                id: 2,
                name: 'Manager',
                permissions: [
                  { id: 3, name: 'view_reports', description: 'View reports' },
                  { id: 4, name: 'manage_opportunities', description: 'Manage opportunities' },
                ],
              },
            ],
            avatar: undefined,
            expires: undefined,
          },
        ],
        total: 2,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  'users/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.getRoles();
      // return response.data;
      
      // Mock response for now
      return [
        {
          id: 1,
          name: 'Administrator',
          permissions: [
            { id: 1, name: 'user_management', description: 'Manage users' },
            { id: 2, name: 'system_config', description: 'Configure system' },
            { id: 3, name: 'view_reports', description: 'View reports' },
            { id: 4, name: 'manage_opportunities', description: 'Manage opportunities' },
          ],
        },
        {
          id: 2,
          name: 'Manager',
          permissions: [
            { id: 3, name: 'view_reports', description: 'View reports' },
            { id: 4, name: 'manage_opportunities', description: 'Manage opportunities' },
          ],
        },
        {
          id: 3,
          name: 'User',
          permissions: [
            { id: 5, name: 'view_own_data', description: 'View own data' },
            { id: 6, name: 'edit_own_profile', description: 'Edit own profile' },
          ],
        },
      ];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch roles';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id' | 'roles'> & { roleIds: number[] }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.createUser(userData);
      // return response.data;
      
      // Mock response for now
      return {
        ...userData,
        id: Date.now(),
        roles: userData.roleIds.map(roleId => ({
          id: roleId,
          name: 'User',
          permissions: [],
        })),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (userData: Partial<User> & { id: number; roleIds?: number[] }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.updateUser(userData);
      // return response.data;
      
      // Mock response for now
      return userData;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // await usersService.deleteUser(userId);
      return userId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const activateUser = createAsyncThunk(
  'users/activateUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.activateUser(userId);
      // return response.data;
      
      return { id: userId, active: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to activate user';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'users/deactivateUser',
  async (userId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await usersService.deactivateUser(userId);
      // return response.data;
      
      return { id: userId, active: false };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deactivate user';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UsersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<UsersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<{ field: keyof User; direction: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        role: '',
        status: '',
      };
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch roles
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Create user
    builder
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.pagination.total += 1;
        state.selectedUser = action.payload;
      });

    // Update user
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload };
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = { ...state.selectedUser, ...action.payload };
        }
      });

    // Delete user
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      });

    // Activate user
    builder
      .addCase(activateUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.id);
        if (user) {
          user.active = action.payload.active;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.active = action.payload.active;
        }
      });

    // Deactivate user
    builder
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.id === action.payload.id);
        if (user) {
          user.active = action.payload.active;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.active = action.payload.active;
        }
      });
  },
});

// Export actions
export const {
  setSelectedUser,
  setFilters,
  setPagination,
  setSortBy,
  clearFilters,
  clearError,
} = usersSlice.actions;

// Export reducer
export default usersSlice.reducer;
