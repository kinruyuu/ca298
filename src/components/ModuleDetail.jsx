import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';

const ModuleDetail = () => {
  const { moduleCode } = useParams(); // Capture the module code from the URL
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/module/${moduleCode}/`);
        setModuleDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the module details:', error);
        setLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleCode]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Module: {moduleDetails?.full_name}
      </Typography>
      <Typography variant="h6">
        Code: {moduleCode}
      </Typography>
      <Typography>
        CA Split: {moduleDetails?.ca_split}%
      </Typography>
      {/* Display more module details as needed */}
    </Container>
  );
};

export default ModuleDetail;
