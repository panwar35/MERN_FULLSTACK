import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
} from '@mui/material';
import axios from 'axios';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your tickets');
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get('http://localhost:5000/api/tickets/my-tickets', config);
        setTickets(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred');
      }
    };

    fetchTickets();
  }, []);

  const handleCancelTicket = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.put(`http://localhost:5000/api/tickets/${ticketId}/cancel`, {}, config);
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? { ...ticket, status: 'cancelled' } : ticket
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          My Tickets
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          {tickets.map((ticket) => (
            <Grid item xs={12} sm={6} md={4} key={ticket._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {ticket.eventName}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Date: {new Date(ticket.eventDate).toLocaleDateString()}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Quantity: {ticket.quantity}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Price: ${ticket.price * ticket.quantity}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  {ticket.status !== 'cancelled' && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleCancelTicket(ticket._id)}
                    >
                      Cancel Ticket
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default MyTickets; 