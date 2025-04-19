import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import {
  Event as EventIcon,
  Support as SupportIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const features = [
    {
      title: 'Book Tickets',
      description: 'Browse and book tickets for various events',
      icon: <EventIcon fontSize="large" />,
      path: '/book-ticket',
    },
    {
      title: 'Customer Service',
      description: 'Get help with your tickets or any other queries',
      icon: <SupportIcon fontSize="large" />,
      path: '/customer-service',
    },
    {
      title: 'Manage Tickets',
      description: 'View and manage your booked tickets',
      icon: <PersonIcon fontSize="large" />,
      path: '/my-tickets',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Ticket Booking System
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Book tickets for your favorite events and get instant support
        </Typography>

        {!isAuthenticated && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              sx={{ mr: 2 }}
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Box>
        )}

        <Grid container spacing={4} sx={{ mt: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(feature.path)}
                  >
                    Get Started
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" gutterBottom>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Easy Booking
              </Typography>
              <Typography color="textSecondary">
                Simple and intuitive ticket booking process
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                24/7 Support
              </Typography>
              <Typography color="textSecondary">
                Round-the-clock customer service support
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Secure Payments
              </Typography>
              <Typography color="textSecondary">
                Safe and secure payment processing
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 