import React from 'react';
import { Container, Typography } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Welcome to the University System</Typography>
      <Typography paragraph>
        This is the home page of the university system. Use the navigation bar to explore different sections like Degrees, Students, and more.
      </Typography>
    </Container>
  );
};

export default HomePage;
