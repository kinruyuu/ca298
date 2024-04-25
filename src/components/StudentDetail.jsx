import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, CircularProgress, Card, CardContent, CardActions,
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      setLoading(true);
      try {
        const studentRes = await axios.get(`http://127.0.0.1:8000/api/student/${studentId}/`);
        const cohortId = studentRes.data.cohort.split('/').filter(Boolean).pop(); // Extract cohort ID
        setStudent(studentRes.data);
  
        // Fetch modules for this cohort and initialize grades as 'n/a'
        const modulesRes = await axios.get(`http://127.0.0.1:8000/api/module/?delivered_to=${cohortId}`);
        let modulesWithGrades = modulesRes.data.map(module => ({
          ...module,
          grades: {
            ca_mark: 'n/a',
            exam_mark: 'n/a',
            total_grade: 'n/a'
          }
        }));
  
        // Fetch grades for this student and merge with modules
        const gradesRes = await axios.get(`http://127.0.0.1:8000/api/grade/?student=${studentId}`);
        gradesRes.data.forEach(grade => {
          // Extract module ID from grade.module URL
          const moduleId = grade.module.split('/').filter(Boolean).pop();
          // Find the corresponding module and update the grade
          let moduleToUpdate = modulesWithGrades.find(m => m.code === moduleId);
          if (moduleToUpdate) {
            moduleToUpdate.grades = {
              ca_mark: grade.ca_mark || 'n/a',
              exam_mark: grade.exam_mark || 'n/a',
              total_grade: grade.total_grade || 'n/a'
            };
          }
        });
  
        setModules(modulesWithGrades);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudentDetails();
  }, [studentId]);
  
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Student Details
          </Typography>
          <Typography variant="body1">Name: {student?.first_name} {student?.last_name}</Typography>
          <Typography variant="body1">Student ID: {student?.student_id}</Typography>
          <Link to={`/cohorts/${student?.cohort}`}>Cohort ID: {student?.cohort}</Link>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => navigate(-1)}>Go Back</Button>
        </CardActions>
      </Card>

      <Typography gutterBottom variant="h5" component="div" style={{ marginTop: '20px' }}>
        Modules and Grades
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Module</TableCell>
              <TableCell align="right">CA Mark</TableCell>
              <TableCell align="right">Exam Mark</TableCell>
              <TableCell align="right">Total Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((module, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {module.full_name}
                </TableCell>
                <TableCell align="right">{module.grades.ca_mark}</TableCell>
                <TableCell align="right">{module.grades.exam_mark}</TableCell>
                <TableCell align="right">{module.grades.total_grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default StudentDetail;
