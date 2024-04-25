import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert, Box
} from '@mui/material';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5)
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2)
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5)
}));

function SetStudentGrade() {
  const [data, setData] = useState({ students: [], modules: [], cohorts: [] });
  const [selected, setSelected] = useState({ student: '', module: '', cohort: '' });
  const [marks, setMarks] = useState({ caMark: '', examMark: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ open: false, text: '', severity: 'info' });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [studentsRes, modulesRes, cohortsRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/student/'),
          axios.get('http://127.0.0.1:8000/api/module/'),
          axios.get('http://127.0.0.1:8000/api/cohort/')
        ]);
        setData({
          students: studentsRes.data,
          modules: modulesRes.data,
          cohorts: cohortsRes.data
        });
      } catch (error) {
        setMessage({ open: true, text: 'Failed to fetch data', severity: 'error' });
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSelectChange = (field) => (event) => {
    setSelected({ ...selected, [field]: event.target.value });
  };

  const handleMarkChange = (field) => (event) => {
    setMarks({ ...marks, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selected.student || !selected.module || !selected.cohort || marks.caMark === '' || marks.examMark === '') {
      setMessage({ open: true, text: 'All fields are required', severity: 'error' });
      return;
    }
  
    setLoading(true);
  
    try {
      // Check if the grade already exists
      const existingGradesResponse = await axios.get(`http://127.0.0.1:8000/api/grade/?student=${selected.student}&module=${selected.module}`);
      const existingGrade = existingGradesResponse.data.length ? existingGradesResponse.data[0] : null;
  
      if (existingGrade) {
        // If the grade exists, update it with a PATCH request
        await axios.patch(`http://127.0.0.1:8000/api/grade/${existingGrade.id}/`, {
          ca_mark: marks.caMark,
          exam_mark: marks.examMark,
        });
      } else {
        // If the grade doesn't exist, create it with a POST request
        await axios.post('http://127.0.0.1:8000/api/grade/', {
          student: `http://127.0.0.1:8000/api/student/${selected.student}/`,
          module: `http://127.0.0.1:8000/api/module/${selected.module}/`,
          cohort: `http://127.0.0.1:8000/api/cohort/${selected.cohort}/`,
          ca_mark: marks.caMark,
          exam_mark: marks.examMark,
        });
      }
  
      setMessage({ open: true, text: 'Grade updated successfully!', severity: 'success' });
    } catch (error) {
      setMessage({ open: true, text: 'Failed to update grade', severity: 'error' });
      console.error('Error updating grade:', error);
    }
  
    setLoading(false);
  };
  const handleCloseMessage = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>
          Set Student Grade
        </Typography>
        {message.open && <Snackbar open={message.open} autoHideDuration={6000} onClose={handleCloseMessage}>
          <Alert onClose={handleCloseMessage} severity={message.severity} sx={{ width: '100%' }}>
            {message.text}
          </Alert>
        </Snackbar>}
        <StyledForm onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-cohort-label">Cohort</InputLabel>
            <Select
              labelId="select-cohort-label"
              id="select-cohort"
              value={selected.cohort}
              onChange={handleSelectChange('cohort')}
              label="Cohort"
            >
              {data.cohorts.map((cohort) => (
                <MenuItem key={cohort.id} value={cohort.id}>{cohort.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-student-label">Student</InputLabel>
            <Select
              labelId="select-student-label"
              id="select-student"
              value={selected.student}
              onChange={handleSelectChange('student')}
              label="Student"
            >
              {data.students.map((student) => (
                <MenuItem key={student.student_id} value={student.student_id}>{`${student.first_name} ${student.last_name}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-module-label">Module</InputLabel>
            <Select
              labelId="select-module-label"
              id="select-module"
              value={selected.module}
              onChange={handleSelectChange('module')}
              label="Module"
            >
              {data.modules.map((module) => (
                <MenuItem key={module.code} value={module.code}>{module.full_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            required
            fullWidth
            id="caMark"
            label="CA Mark"
            name="caMark"
            value={marks.caMark}
            onChange={handleMarkChange('caMark')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="examMark"
            label="Exam Mark"
            name="examMark"
            value={marks.examMark}
            onChange={handleMarkChange('examMark')}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <StyledButton
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Submit
            </StyledButton>
            <Button
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              onClick={() => window.history.back()} // Adjust as needed for navigation
            >
              Back
            </Button>
          </Box>
        </StyledForm>
      </StyledPaper>
    </Container>
  );
}

export default SetStudentGrade;


