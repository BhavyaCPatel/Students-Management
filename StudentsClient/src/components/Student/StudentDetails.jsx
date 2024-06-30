import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { z } from 'zod';
import DetailsCard from './DetailsCard';

export default function StudentDetails() {
    const toast = useRef(null);
    const [editMode, setEditMode] = useState(false);

    const singupschema = z.object({
        username: z.string().min(1, { message: "Username is required" }),
        name: z.string().min(1, { message: "Name is required" }),
        enrollno: z.number().int().refine(val => val.toString().length === 14, { message: "Enrollment number must be 14 digits" }),
        branch: z.string().min(1, { message: "Branch is required" }),
        sem: z.number().int().refine(val => val.toString().length === 1, { message: "Invalid Semester, only 1 digit allowed" }),
        contact: z.number().int().refine(val => val.toString().length === 10, { message: "Contact number must be 10 digits" }),
        email: z.string().email({ message: "Invalid email address" }),
        faculty_id: z.string().min(1, { message: "Faculty is required" }),
        DOB: z.date(),
        address: z.string().min(1, { message: "Address is required" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    });

    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [value, setValue] = useState({
        username: "",
        name: "",
        enrollno: "",
        branch: "",
        sem: "",
        contact: "",
        email: "",
        faculty_id: "",
        DOB: new Date(), // Initialize DOB as a Date object
        address: "",
        password: ""
    });

    const [studentData, setStudentData] = useState(null); // State to hold student data

    useEffect(() => {
        const fetchFaculties = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/faculty/all');
                setFaculties(response.data);
            } catch (error) {
                console.error('Error fetching faculties:', error);
            }
        };

        fetchFaculties();
    }, []);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://localhost:4000/api/student/`, {
                    headers: {
                        authorization: `${token}`
                    }
                });
                const studentData = response.data;
                setStudentData(studentData); // Store student data in state
                setValue({
                    username: studentData.username,
                    name: studentData.name,
                    enrollno: studentData.enrollno,
                    branch: studentData.branch,
                    sem: studentData.sem,
                    contact: studentData.contact,
                    email: studentData.email,
                    faculty_id: studentData.faculty_id || '',
                    DOB: studentData.DOB ? new Date(studentData.DOB) : new Date(), // Convert DOB to Date object, handle if DOB is null or undefined
                    address: studentData.address,
                    password: ""
                });
                const faculty = faculties.find(fac => fac._id === studentData.faculty_id);
                setSelectedFaculty(faculty);

            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentData();

    }, [faculties]);

    const header = (
        <h2 className='text-center'>{value.name}</h2>
    );

    const handleEditClick = () => {
        setEditMode(true);
    };

    const submit = async () => {

        const result = singupschema.safeParse({
            username: value.username,
            name: value.name,
            enrollno: value.enrollno,
            branch: value.branch,
            sem: value.sem,
            contact: parseInt(value.contact),
            email: value.email,
            faculty_id: selectedFaculty ? selectedFaculty._id : "",
            DOB: value.DOB,
            address: value.address,
            password: value.password
        });

        if (!result.success) {
            const firstError = result.error.issues[0];
            toast.current.show({ severity: 'error', summary: 'Validation Error', detail: firstError.message, life: 5000 });
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:4000/api/student/`, result.data, {
                headers: {
                    'authorization': `${token}`
                }
            });
            setValue({
                username: "",
                name: "",
                enrollno: "",
                branch: "",
                sem: "",
                contact: "",
                email: "",
                faculty_id: "",
                DOB: new Date(), 
                address: "",
                password: ""
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Student updated successfully', life: 5000 });
            setEditMode(false);
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User already exists', life: 5000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Update failed', life: 5000 });
            }
        }
    };

    const footer = (
        <div>
            {!editMode ? (
                <Button label="Edit" icon="pi pi-pencil" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={handleEditClick} />
            ) : (
                <div>
                    <Button label="Save" icon="pi pi-check" className='mb-3 mx-1 bg-blue-500 border-blue-500 custom-button' onClick={submit} />
                    <Button label="Cancel" icon="pi pi-times" className='mb-3 mx-1 bg-red-500 border-red-500 custom-button ' onClick={() => setEditMode(false)} />
                </div>
            )}
        </div>
    );

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.id]: e.target.value
        });
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.value);
    };

    const handleViewMarksheet = () => {
        if (studentData && studentData.files) {
            const files = studentData.files;
            console.log(files)
            if (Array.isArray(files) && files.length > 0) {
                files.forEach(file => {
                    if (file._id) {
                        window.open(`http://localhost:4000/api/files/file/${file._id}`, '_blank');
                    }
                });
            } else if (files._id) {
                window.open(`http://localhost:4000/api/files/file/${files._id}`, '_blank');
            } else {
                console.error('Invalid files structure:', files);
            }
        } else {
            console.error('Invalid studentData or files structure:', studentData);
        }
    };

    return (
        <div className="card flex justify-content-center text-center edit-background">
            <DetailsCard
                header={header}
                footer={footer}
                value={value}
                editMode={editMode}
                handleChange={handleChange}
                selectedFaculty={selectedFaculty}
                handleFacultyChange={handleFacultyChange}
                faculties={faculties}
                handleViewMarksheet={handleViewMarksheet}
                className='text-white'
            />
            <Toast ref={toast} />
        </div>
    );
}
