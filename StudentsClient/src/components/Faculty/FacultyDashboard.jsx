import React from 'react'
import Table from './Table'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';


const FacultyDashboard = () => {

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
    <div className='flex'>
      <h1>Faculty Dashboard</h1>
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
    <Table/>
    
    </>
  )
}

export default FacultyDashboard