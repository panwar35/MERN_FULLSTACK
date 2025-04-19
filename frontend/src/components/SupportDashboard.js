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
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to access the dashboard');
          return;
        }

        const config = {
          headers: {
            'x-auth-token': token,
          },
        };

        const res = await axios.get('http://localhost:5000/api/customer-service', config);
        setTickets(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred');
      }
    };

    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.put(
        `http://localhost:5000/api/customer-service/${ticketId}/status`,
        { status },
        config
      );

      setTickets(tickets.map(ticket =>
        ticket._id === ticketId ? { ...ticket, status } : ticket
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.post(
        `http://localhost:5000/api/customer-service/${selectedTicket._id}/response`,
        { message: response },
        config
      );

      // Refresh tickets
      const res = await axios.get('http://localhost:5000/api/customer-service', config);
      setTickets(res.data);
      setResponse('');
      setSelectedTicket(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Support Dashboard
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {tickets.map((ticket) => (
              <Card key={ticket._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {ticket.subject}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {ticket.message}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                    />
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Change Status</InputLabel>
                      <Select
                        value={ticket.status}
                        label="Change Status"
                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="in-progress">In Progress</MenuItem>
                        <MenuItem value="resolved">Resolved</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {ticket.responses && ticket.responses.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Responses:
                      </Typography>
                      {ticket.responses.map((response, index) => (
                        <Typography key={index} color="textSecondary" sx={{ ml: 2 }}>
                          {response.message}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    Add Response
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Grid>
        </Grid>

        {selectedTicket && (
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Add Response to: {selectedTicket.subject}
            </Typography>
            <form onSubmit={handleResponseSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                label="Your Response"
                required
              />
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                >
                  Submit Response
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSelectedTicket(null);
                    setResponse('');
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SupportDashboard; 