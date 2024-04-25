import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const DegreesComponent = () => {
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDegrees = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/degree/');
        setDegrees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the degrees:', error);
        setLoading(false);
      }
    };

    fetchDegrees();
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
        Degrees
      </Typography>
      <List>
        {degrees.map((degree) => (
          <ListItem key={degree.shortcode} button component={Link} to={`/degrees/${degree.shortcode}`}>
            <ListItemText primary={degree.full_name} secondary={`Shortcode: ${degree.shortcode}`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default DegreesComponent;
