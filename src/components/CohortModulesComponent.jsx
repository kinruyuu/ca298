import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const CohortModulesComponent = () => {
  const { cohortId } = useParams(); // Capture the cohortId from the URL
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/module/?delivered_to=${cohortId}`);
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the modules for the cohort:', error);
        setLoading(false);
      }
    };

    fetchModules();
  }, [cohortId]);

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
        Modules for Cohort: {cohortId}
      </Typography>
      <List>
        {modules.map((module) => (
          <ListItem key={module.code}>
            <ListItemText primary={module.full_name} secondary={`Code: ${module.code}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CohortModulesComponent;
