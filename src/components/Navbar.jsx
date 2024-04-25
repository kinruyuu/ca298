import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          University System
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/degrees">Degrees</Button>
        <Button color="inherit" component={Link} to="/degrees/new">Add New Degree</Button>
        <Button color="inherit" component={Link} to="/cohorts">View Cohorts</Button>
        <Button color="inherit" component={Link} to="/cohorts/new">Add New Cohort</Button>
        <Button color="inherit" component={Link} to="/modules">View Modules</Button>
        <Button color="inherit" component={Link} to="/modules/new">Add New Module</Button>
        <Button color="inherit" component={Link} to="/students/new">Add New Student</Button>
        <Button color="inherit" component={Link} to="/set-grade">Set Grade</Button>
        {/* Add more Button components for additional navigation links as needed */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
