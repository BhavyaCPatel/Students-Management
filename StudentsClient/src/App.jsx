import React from 'react';
import 'primereact/resources/themes/saga-blue/theme.css';
import "primeicons/primeicons.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import FacultyDashboard from './components/Faculty/FacultyDashboard.jsx';
import StudentDashboard from './components/Student/StudentDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <span className='gradient'></span>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/facultydashboard" element={
            <ProtectedRoute>
              <FacultyDashboard />
            </ProtectedRoute>
          } />
          <Route path="/studentdashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;