import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import StudentDetails from './StudentDetails';

const StudentDashboard = () => {

  const navigate = useNavigate();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const handleUserIconClick = () => {
      setIsLogoutVisible(prevState => !prevState);
  };

  const handleLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userId');
      navigate('/login');
  };

  return (
    <>
    <div className='flex mb-5'>
      <h1>Student Dashboard</h1>
      <div className="user-icon-container">
                <i 
                    id="userIcon" 
                    className="pi pi-user p-3 bg-white text-blue-500" 
                    style={{ fontSize: '1.25rem', borderRadius: '50%', cursor: 'pointer' }}
                    onClick={handleUserIconClick}
                ></i>
                {isLogoutVisible && (
                    <Button 
                        label="Logout" 
                        icon="pi pi-sign-out" 
                        className="p-button-danger logout-button custom-button" 
                        onClick={handleLogout} 
                    />
                )}
            </div>
    </div>
    <StudentDetails/>
    </>
  )
}

export default StudentDashboard