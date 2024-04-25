import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, Button, CircularProgress, Grid } from '@mui/material';

const CohortsComponent = () => {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/cohort/');
        setCohorts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the cohorts:', error);
        setLoading(false);
      }
    };

    fetchCohorts();
  }, []);

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
        Cohorts
      </Typography>
      <List>
        {cohorts.map((cohort) => (
          <ListItem key={cohort.id} divider>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1">{`Cohort ID: ${cohort.id}`}</Typography>
                <Typography variant="body2">{`Year: ${cohort.year} - Degree: ${cohort.degree}`}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} container justifyContent="flex-end">
                <Button 
                  component={Link} 
                  to={`/cohorts/${cohort.id}`} 
                  color="primary"
                  style={{ marginRight: 16 }}
                >
                  Details
                </Button>
                <Button 
                  component={Link} 
                  to={`/cohorts/${cohort.id}/modules`} 
                  variant="contained" 
                  color="primary"
                >
                  View Modules
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CohortsComponent;
