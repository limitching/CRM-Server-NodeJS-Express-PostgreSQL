
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ActivateAccountPage } from './pages/ActivateAccountPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ROUTES } from './constants';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                  <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                  <Route path={ROUTES.ACTIVATE_ACCOUNT} element={<ActivateAccountPage />} />
                  
                  {/* Protected routes */}
                  <Route
                    path={ROUTES.LANDING}
                    element={
                      <ProtectedRoute>
                        <LandingPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route
                    path={ROUTES.DASHBOARD}
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Default redirect */}
                  <Route
                    path={ROUTES.HOME}
                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                  />
                  
                  {/* Catch all - redirect to dashboard */}
                  <Route
                    path="*"
                    element={<Navigate to={ROUTES.DASHBOARD} replace />}
                  />
                </Routes>
              </Router>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
