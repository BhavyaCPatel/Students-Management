import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Avatar } from 'primereact/avatar';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import StudentDetails from './StudentDetails';
import { FileUpload } from 'primereact/fileupload';
import { Image } from 'primereact/image'
const StudentDashboard = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProfilePic = async () => {
            try {
                const studId = localStorage.getItem('studId');
                if (!studId) {
                    console.error('Student ID not found in local storage');
                    return;
                }
                console.log('Fetching profile pic for student ID:', studId);
                const response = await axios.get(`http://localhost:4000/api/files/profilepic/${studId}`, {
                    responseType: 'blob',
                });
                const url = URL.createObjectURL(response.data);
                setProfilePic(url);
                console.log('Profile pic URL:', url);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };
        fetchProfilePic();
    }, []);

    const handleUserIconClick = () => {
        setIsDialogVisible(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('studId');
        navigate('/login');
    };

    const handleFileSelect = (e) => {
        setFile(e.files[0]);
    };

    const handleUpload = async () => {
        const studId = localStorage.getItem('studId');
        if (!studId) {
            console.error('Student ID not found in local storage');
            return;
        }
        console.log('Uploading profile pic for student ID:', studId);

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Auth token not found in local storage');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:4000/api/files/upload/profilepic/${studId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `${token}`
                },
            });

            const blob = new Blob([response.data.file.buffer], { type: response.data.file.contentType });
            const url = URL.createObjectURL(blob);
            setProfilePic(url);
            console.log('Uploaded profile pic URL:', url);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Profile photo uploaded successfully', life: 5000 });
            setIsDialogVisible(false);
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to upload profile photo', life: 5000 });
        }
    };

    return (
        <>
            <div className='flex mb-5 justify-content-between'>
                <h1>Student Dashboard</h1>
                <div className="user-icon-container">
                    {profilePic ? (
                        <Avatar image={profilePic} shape="circle" size="xlarge" style={{ cursor: 'pointer' }} onClick={handleUserIconClick} />
                    ) : (
                        <i
                            id="userIcon"
                            className="pi pi-user p-3 bg-white text-blue-500"
                            style={{ fontSize: '1.25rem', borderRadius: '50%', cursor: 'pointer' }}
                            onClick={handleUserIconClick}
                        ></i>
                    )}
                </div>
            </div>
            <StudentDetails />
            <Dialog header="User Options" visible={isDialogVisible} onHide={() => { setIsDialogVisible(false) }} className='upload-modal' >
                <i className="pi pi-times" style={{ float: 'right', margin: '-15px', cursor: 'pointer' }} onClick={() => setIsDialogVisible(false)} ></i>
                <div className="flex flex-column align-items-center m-3">
                    <Image src={profilePic} alt="Image" width="200" preview />
                    <FileUpload
                        mode="basic"
                        accept="image/*"
                        name="file"
                        customUpload
                        uploadHandler={handleUpload}
                        onSelect={handleFileSelect}
                        className="p-button-success p-button-rounded ml-1"
                        chooseLabel="Upload New Photo"
                    />
                    <Button label="Logout" icon="pi pi-sign-out" className="p-button-danger mt-3" onClick={handleLogout} />
                </div>
            </Dialog>
            <Toast ref={toast} />
        </>
    );
};

export default StudentDashboard;
