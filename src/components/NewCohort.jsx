import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  CircularProgress,
  Alert
} from '@mui/material';

const NewCohort = () => {
  const [cohortId, setCohortId] = useState('');
  const [year, setYear] = useState('');
  const [degreeShortcode, setDegreeShortcode] = useState('');
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/degree/')
      .then(response => {
        setDegrees(response.data);
        if (response.data.length > 0) {
          setDegreeShortcode(response.data[0].shortcode); // Safely set to the first degree
        }
      })
      .catch(error => {
        console.error('There was an error fetching the degrees:', error);
        setError('Failed to fetch degrees');
        setSnackbarMessage('Failed to fetch degrees');
        setSnackbarOpen(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cohortId || !year || !degreeShortcode) {
      setSnackbarMessage('Please fill in all fields');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    const degreeUrl = `http://127.0.0.1:8000/api/degree/${degreeShortcode}/`;
    
    try {
      await axios.post('http://127.0.0.1:8000/api/cohort/', {
        id: cohortId,
        year: parseInt(year, 10),
        degree: degreeUrl,
      });
      setSnackbarMessage('Cohort created successfully!');
      setSnackbarOpen(true);
      navigate('/cohorts');
    } catch (error) {
      console.error(error.response || error.message);
      setError('Failed to create cohort');
      setSnackbarMessage('Failed to create cohort. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <h1>Create New Cohort</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Cohort ID"
          value={cohortId}
          onChange={(e) => setCohortId(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="degree-label">Degree</InputLabel>
          <Select
            labelId="degree-label"
            value={degreeShortcode}
            onChange={(e) => setDegreeShortcode(e.target.value)}
            label="Degree"
            required
          >
            {degrees.map((degree) => (
              <MenuItem key={degree.shortcode} value={degree.shortcode}>
                {degree.full_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" color="primary" variant="contained" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Cohort'}
        </Button>
      </form>

      {/* Snackbar for feedback messages */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewCohort;
