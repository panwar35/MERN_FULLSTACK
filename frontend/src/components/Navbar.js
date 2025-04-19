import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import {
  Event as EventIcon,
  Support as SupportIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Ticket Booking System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<EventIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/book-ticket"
            startIcon={<EventIcon />}
          >
            Book Tickets
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/customer-service"
            startIcon={<SupportIcon />}
          >
            Customer Service
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/my-tickets"
                startIcon={<EventIcon />}
              >
                My Tickets
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<PersonIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
                startIcon={<PersonIcon />}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/register"
                startIcon={<PersonIcon />}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 