import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import DegreesComponent from './components/DegreesComponent';
import DegreeDetail from './components/DegreeDetail'; // Import the DegreeDetail component
import NewDegree from './components/NewDegree'; // Import the NewDegree component
import CohortsComponent from './components/CohortsComponent'; // Import the CohortsComponent
import CohortDetail from './components/CohortDetail'; // Import the CohortDetail component
import NewCohort from './components/NewCohort'; // Import the NewCohort component
import ModulesComponent from './components/ModulesComponent'; // Import the ModulesComponent
import ModuleDetail from './components/ModuleDetail'; // Import the ModuleDetail component
import CohortModulesComponent from './components/CohortModulesComponent'; // Import the CohortModulesComponent
import NewModule from './components/NewModule'; // Import the NewModule component
import StudentDetail from './components/StudentDetail'; // Import the StduentDetail component
import NewStudent from './components/NewStudent'; // Import the NewStudent component
import SetStudentGrade from './components/SetStudentGrade'; // Import the SetStudentGrade component



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/degrees" element={<DegreesComponent />} />
        <Route path="/degrees/:degreeCode" element={<DegreeDetail />} /> {/* Parameterized route for DegreeDetail */}
        <Route path="/degrees/new" element={<NewDegree />} /> {/* Route for NewDegree */}
        <Route path="/cohorts" element={<CohortsComponent />} /> {/* Route for CohortsComponent */}
        <Route path="/cohorts/:cohortId" element={<CohortDetail />} /> {/* Parameterized route for CohortDetail */}
        <Route path="/cohorts/new" element={<NewCohort />} /> {/* Route for NewCohort */}
        <Route path="/modules" element={<ModulesComponent />} /> {/* Route for ModulesComponent */}
        <Route path="/modules/:moduleCode" element={<ModuleDetail />} /> {/* Parameterized route for ModuleDetail */}
        <Route path="/cohorts/:cohortId/modules" element={<CohortModulesComponent />} /> {/* Parameterized route for CohortModulesComponent */}
        <Route path="/modules/new" element={<NewModule />} /> {/* Route for NewModule */}
        <Route path="/student/:studentId" element={<StudentDetail />} /> {/* Parameterized route for StudentDetail */}
        <Route path="/students/new" element={<NewStudent />} /> {/* Route for NewStudent */}
        <Route path="/set-grade" element={<SetStudentGrade />} />
      </Routes>
    </Router>
  );
}

export default App;
