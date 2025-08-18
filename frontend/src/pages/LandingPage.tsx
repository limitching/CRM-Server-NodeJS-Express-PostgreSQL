import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Business,
  People,
  TrendingUp,
  Assignment,
  Settings,
  Dashboard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants';

export const LandingPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const featureCards = [
    {
      title: 'Dashboard',
      description: 'View key metrics and performance indicators',
      icon: <Dashboard sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      route: ROUTES.DASHBOARD,
    },
    {
      title: 'Accounts',
      description: 'Manage customer accounts and company information',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      route: ROUTES.ACCOUNTS,
    },
    {
      title: 'Contacts',
      description: 'Organize and manage customer contacts',
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      route: ROUTES.CONTACTS,
    },
    {
      title: 'Opportunities',
      description: 'Track sales pipeline and opportunities',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      route: ROUTES.OPPORTUNITIES,
    },
    {
      title: 'Reminders',
      description: 'Manage tasks and important reminders',
      icon: <Assignment sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      route: ROUTES.REMINDERS,
    },
    {
      title: 'Settings',
      description: 'Configure system settings and preferences',
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: '#5d4037',
      route: ROUTES.SETTINGS,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Welcome to CRM System
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Manage your customer relationships, sales pipeline, and business operations
        </Typography>
        
        {/* User Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.username?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">
              {user?.username || 'User'}
            </Typography>
            <Chip 
              label={user?.roles?.[0]?.name || 'User'} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleLogout}
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Feature Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
        {featureCards.map((card, index) => (
          <Card 
            key={index}
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <Box sx={{ color: card.color, mb: 2 }}>
                {card.icon}
              </Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {card.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                size="small" 
                variant="contained"
                onClick={() => navigate(card.route)}
                sx={{ 
                  bgcolor: card.color,
                  '&:hover': { bgcolor: card.color, opacity: 0.8 }
                }}
              >
                Go to {card.title}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Quick Stats */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Quick Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is a simple landing page. As you complete more tasks, you'll see real data and metrics here.
        </Typography>
      </Box>
    </Container>
  );
};
