import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import dashboardSlice from './slices/dashboardSlice';
import accountsSlice from './slices/accountsSlice';
import contactsSlice from './slices/contactsSlice';
import opportunitiesSlice from './slices/opportunitiesSlice';
import usersSlice from './slices/usersSlice';
import { devToolsConfig } from './devTools';

// Persist configuration for auth state
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'rememberMe'],
};

// Persist configuration for UI state
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'language', 'sidebarCollapsed'],
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authSlice);
const persistedUiReducer = persistReducer(uiPersistConfig, uiSlice);

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: persistedUiReducer,
    dashboard: dashboardSlice,
    accounts: accountsSlice,
    contacts: contactsSlice,
    opportunities: opportunitiesSlice,
    users: usersSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: devToolsConfig.devTools,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
