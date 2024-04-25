import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, FormControl, 
  InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert 
} from '@mui/material';

const NewStudent = () => {
  const [studentId, setStudentId] = useState('');
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/cohort/')
      .then(response => {
        setCohorts(response.data);
        if (response.data.length > 0) {
          setSelectedCohort(response.data[0].id);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cohorts:', error);
        setSnackbarMessage('Failed to fetch cohorts');
        setSnackbarOpen(true);
        setLoading(false);
      });
  }, []);

  const validateStudentId = (id) => {
    return /^\d{8}$/.test(id); // regex to ensure id is exactly 8 digits
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStudentId(studentId)) {
      setSnackbarMessage('Student ID must be exactly 8 digits');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);

    try {
      await axios.post('http://127.0.0.1:8000/api/student/', {
        student_id: studentId,
        first_name: firstName,
        last_name: lastName,
        cohort: `http://127.0.0.1:8000/api/cohort/${selectedCohort}/`,
      });
      setSnackbarMessage('Student created successfully!');
      setSnackbarOpen(true);
      navigate(`/student/${studentId}`);
    } catch (error) {
      console.error('Error creating new student:', error);
      setSnackbarMessage('Failed to create new student. Please check the data and try again.');
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
      <Typography variant="h4" gutterBottom>Create New Student</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Student ID *"
          fullWidth
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          margin="normal"
          required
          inputProps={{ maxLength: 8 }}
          helperText="Must be 8 digits"
        />
        <TextField
          label="First Name *"
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          label="Last Name *"
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="cohort-label">Cohort *</InputLabel>
          <Select
            labelId="cohort-label"
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            label="Cohort *"
          >
            {cohorts.map((cohort) => (
              <MenuItem key={cohort.id} value={cohort.id}>
                {cohort.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading} 
          style={{ marginTop: '20px' }}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Student'}
        </Button>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NewStudent;
