import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  Container,
  Button,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../constants';
import { authService } from '../services/authService';

export const ActivateAccountPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const activateUserAccount = async () => {
      const key = searchParams.get('key');
      
      if (!key) {
        setError('Invalid activation link. Please check your email for the correct link.');
        setLoading(false);
        return;
      }

      try {
        await authService.activateAccount({ key });
        setSuccess(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Account activation failed');
      } finally {
        setLoading(false);
      }
    };

    activateUserAccount();
  }, [searchParams]);

  // Auto-redirect after showing error for a short time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  // Auto-redirect to login page after successful activation
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 3000); // 3 seconds delay

      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  if (loading) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Activating Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we activate your account...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              Activation Failed
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Account Activation Error
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              {error}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Account Activated Successfully!
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Welcome to CRM!
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Your account has been successfully activated! You will be redirected to the login page in a few seconds.
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              You can now sign in with your username and password.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate(ROUTES.LOGIN)}
              sx={{ mt: 2 }}
            >
              Sign In Now
            </Button>
          </Paper>
        </Box>
      </Container>
    );
  }

  return null;
};
