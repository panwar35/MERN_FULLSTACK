import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import axios from 'axios';

const CustomerService = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

        const res = await axios.get('http://localhost:5000/api/customer-service/my-tickets', config);
        setTickets(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'An error occurred');
      }
    };

    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to submit a ticket');
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.post('http://localhost:5000/api/customer-service', formData, config);
      setSuccess('Support ticket submitted successfully!');
      setFormData({ subject: '', message: '' });
      
      // Refresh tickets list
      const res = await axios.get('http://localhost:5000/api/customer-service/my-tickets', config);
      setTickets(res.data);
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
          Customer Service
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Submit a Support Ticket
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Submit Ticket
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Your Support Tickets
            </Typography>
            {tickets.map((ticket) => (
              <Card key={ticket._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {ticket.subject}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {ticket.message}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={ticket.status}
                      color={getStatusColor(ticket.status)}
                    />
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
              </Card>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CustomerService; 