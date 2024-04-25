import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const DegreeDetail = () => {
  const { degreeCode } = useParams(); // This captures the degreeCode from the URL
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        // Fetch cohorts for the specific degreeCode
        const responseCohorts = await axios.get(`http://127.0.0.1:8000/api/cohort/?degree=${degreeCode}`);
        setCohorts(responseCohorts.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the cohorts:', error);
        setLoading(false);
      }
    };

    fetchCohorts();
  }, [degreeCode]);

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
        Degree: {degreeCode}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Cohorts
      </Typography>
      <List>
        {cohorts.length ? (
          cohorts.map((cohort) => (
            <ListItem key={cohort.id}>
              <ListItemText primary={`Year: ${cohort.year}`} secondary={`ID: ${cohort.id}`} />
            </ListItem>
          ))
        ) : (
          <Typography>No cohorts found for this degree.</Typography>
        )}
      </List>
    </Container>
  );
};

export default DegreeDetail;
