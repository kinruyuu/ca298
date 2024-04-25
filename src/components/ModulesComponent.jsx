import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Chip } from '@mui/material';

const ModulesComponent = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/module/');
        setModules(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the modules:', error);
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const getCohortIdFromUrl = (url) => {
    // Extract the last segment of the URL, decode it, and trim any whitespace
    const cohortId = decodeURIComponent(url.split('/').filter(Boolean).pop());
    return cohortId.trim();
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Modules</Typography>
      <List>
        {modules.map((module) => (
          <ListItem 
            key={module.code} 
            button 
            component={Link} 
            to={`/modules/${module.code}`} // Link to the ModuleDetail page
          >
            <ListItemText 
              primary={module.full_name} 
              secondary={`Code: ${module.code}`}
            />
            {module.delivered_to.map((cohortUrl) => {
              const cleanCohortId = getCohortIdFromUrl(cohortUrl);
              return (
                <Chip 
                  key={cleanCohortId} // Use cleanCohortId for key as it's unique
                  label={cleanCohortId}
                  component={Link} 
                  to={`/cohorts/${cleanCohortId}/modules`}
                  clickable 
                  color="primary" 
                  size="small"
                  style={{ margin: '2px' }}
                />
              );
            })}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ModulesComponent;
