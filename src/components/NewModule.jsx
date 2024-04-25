import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const NewModule = () => {
  const [code, setCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [caSplit, setCaSplit] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohorts, setSelectedCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/cohort/')
      .then(response => {
        setCohorts(response.data);
      })
      .catch(error => {
        console.error('Error fetching cohorts:', error);
        setSnackbarMessage('Failed to fetch cohorts.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCohortChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCohorts(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/api/module/', {
        code,
        full_name: fullName,
        ca_split: parseInt(caSplit, 10),
        delivered_to: selectedCohorts.map(cohortId => `http://127.0.0.1:8000/api/cohort/${cohortId}/`),
      });
      setSnackbarMessage('Module created successfully!');
      setSnackbarSeverity('success');
      navigate('/modules');
    } catch (error) {
      console.error('There was an error creating the module:', error);
      setSnackbarMessage('Failed to create module. Please try again.');
      setSnackbarSeverity('error');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create New Module</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Module Code"
          fullWidth
          margin="normal"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          label="CA Split"
          fullWidth
          margin="normal"
          required
          value={caSplit}
          onChange={(e) => setCaSplit(e.target.value)}
          type="number"
          InputProps={{ inputProps: { min: 0, max: 100 } }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="delivered-to-label">Delivered To</InputLabel>
          <Select
            labelId="delivered-to-label"
            multiple
            value={selectedCohorts}
            onChange={handleCohortChange}
            input={<OutlinedInput label="Delivered To" />}
            renderValue={(selected) => 
              selected.map(cohortId => 
                cohorts.find(cohort => cohort.id === cohortId)?.name || cohortId
              ).join(', ')
            }
          >
            {cohorts.map((cohort) => (
              <MenuItem key={cohort.id} value={cohort.id}>
                {cohort.name} ({cohort.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? <CircularProgress size={24} /> : 'Create Module'}
        </Button>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewModule;
