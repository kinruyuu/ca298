import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, CircularProgress, Button } from '@mui/material';

const CohortDetail = () => {
  const { cohortId } = useParams(); // This captures the cohortId from the URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCohortDetailsAndStudents = async () => {
      try {
        // const responseCohort = await axios.get(`http://127.0.0.1:8000/api/cohort/${cohortId}/`);
        // setCohortDetails(responseCohort.data);

        const responseStudents = await axios.get(`http://127.0.0.1:8000/api/student/?cohort=${cohortId}`);
        setStudents(responseStudents.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the cohort details and students:', error);
        setLoading(false);
      }
    };

    fetchCohortDetailsAndStudents();
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
        Cohort: {cohortId}
      </Typography>
      <Button component={Link} to={`/cohorts/${cohortId}/modules`} color="primary" variant="contained" style={{ marginTop: '20px', marginBottom: '20px' }}>
        View Delivered Modules
      </Button>
      <Typography variant="h6" gutterBottom>
        Students
      </Typography>
      <List>
        {students.length ? (
          students.map((student) => (
            <ListItem key={student.student_id} secondaryAction={
              <Button component={Link} to={`/student/${student.student_id}`} color="primary">
                View Details
              </Button>
            }>
              <ListItemText primary={`${student.first_name} ${student.last_name}`} secondary={`Student ID: ${student.student_id}`} />
            </ListItem>
          ))
        ) : (
          <Typography>No students found in this cohort.</Typography>
        )}
      </List>
    </Container>
  );
};

export default CohortDetail;
