import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Contact } from '../../types';

// Contact state interface
interface ContactsState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: boolean;
  error: string | null;
  filters: {
    search: string;
    status: string;
    company: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  sortBy: {
    field: keyof Contact;
    direction: 'asc' | 'desc';
  };
}

// Initial state
const initialState: ContactsState = {
  contacts: [],
  selectedContact: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: '',
    company: '',
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  sortBy: {
    field: 'first_name',
    direction: 'asc',
  },
};

// Async thunks
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (_params: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    company?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await contactsService.getContacts(params);
      // return response.data;
      
      // Mock response for now
      return {
        contacts: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@techcorp.com',
            phone: '+1-555-0123',
            position: 'CEO',
            accounts: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: 2,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@globalsolutions.com',
            phone: '+1-555-0456',
            position: 'CTO',
            accounts: [],
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 2,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch contacts';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData: Omit<Contact, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await contactsService.createContact(contactData);
      // return response.data;
      
      // Mock response for now
      return {
        ...contactData,
        id: Date.now(),
        created_at: new Date(),
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create contact';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async (contactData: Partial<Contact> & { id: number }, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // const response = await contactsService.updateContact(contactData);
      // return response.data;
      
      // Mock response for now
      return {
        ...contactData,
        updated_at: new Date(),
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update contact';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (contactId: number, { rejectWithValue }) => {
    try {
      // This would call the actual API service
      // await contactsService.deleteContact(contactId);
      return contactId;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete contact';
      return rejectWithValue(errorMessage);
    }
  }
);

// Create slice
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selectedContact = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ContactsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action: PayloadAction<Partial<ContactsState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setSortBy: (state, action: PayloadAction<{ field: keyof Contact; direction: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: '',
        company: '',
      };
      state.pagination.page = 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch contacts
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.contacts;
        state.pagination.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create contact
    builder
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.unshift(action.payload);
        state.pagination.total += 1;
        state.selectedContact = action.payload;
      });

    // Update contact
    builder
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = { ...state.contacts[index], ...action.payload };
        }
        if (state.selectedContact?.id === action.payload.id) {
          state.selectedContact = { ...state.selectedContact, ...action.payload };
        }
      });

    // Delete contact
    builder
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter(contact => contact.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedContact?.id === action.payload) {
          state.selectedContact = null;
        }
      });
  },
});

// Export actions
export const {
  setSelectedContact,
  setFilters,
  setPagination,
  setSortBy,
  clearFilters,
  clearError,
} = contactsSlice.actions;

// Export reducer
export default contactsSlice.reducer;
