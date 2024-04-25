import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewDegree = () => {
  const [degreeData, setDegreeData] = useState({
    fullName: '',
    shortcode: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDegreeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/degree/', {
        full_name: degreeData.fullName,
        shortcode: degreeData.shortcode,
      });
      if (response.status === 201) {
        setSnackbarMessage('Degree created successfully!');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/degrees'), 3000); // Redirect to degrees page after 3 seconds
      }
    } catch (error) {
      console.error('There was an error creating the degree:', error);
      setSnackbarMessage('Failed to create degree. Please try again.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create New Degree</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          fullWidth
          name="fullName"
          value={degreeData.fullName}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          label="Shortcode"
          fullWidth
          name="shortcode"
          value={degreeData.shortcode}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Create Degree
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default NewDegree;

