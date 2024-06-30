import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { z } from 'zod';
import FormCard from '../FormCard';

export default function EditForm({ hide, studentId }) { // Note the destructuring of studentId here
    const toast = useRef(null);

    const singupschema = z.object({
        username: z.string().min(1, { message: "Username is required" }),
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        enrollno: z.number().int().refine(val => val.toString().length === 14, { message: "Enrollment number must be 14 digits" }),
        branch: z.string().min(1, { message: "Branch is required" }),
        sem: z.number().int().refine(val => val.toString().length === 1, { message: "Invalid Semester, only 1 digit allowed" }),
        contact: z.number().int().refine(val => val.toString().length === 10, { message: "Contact number must be 10 digits" }),
        address: z.string().min(1, { message: "Address is required" }),
        DOB: z.date(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        faculty_id: z.string().min(1, { message: "Faculty is required" }),
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
        DOB: "",
        address: "",
        password: ""
    });

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
        if (faculties.length > 0 && studentId) {
            const fetchStudentData = async () => {
                try {
                    const token = localStorage.getItem('authToken');
                    const response = await axios.get(`http://localhost:4000/api/faculty/students/${studentId}`, {
                        headers: {
                            authorization: `${token}`
                        }
                    });
                    const studentData = response.data;
                    setValue({
                        username: studentData.username,
                        name: studentData.name,
                        enrollno: studentData.enrollno,
                        branch: studentData.branch,
                        sem: studentData.sem,
                        contact: studentData.contact,
                        email: studentData.email,
                        faculty_id: studentData.faculty_id,
                        DOB: new Date(studentData.DOB).toISOString().split('T')[0], 
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
        }
    }, [studentId, faculties]);

    const header = (
        <h2 className='text-center'>Edit Student</h2>
    );

    const submit = async () => {
        const result = singupschema.safeParse({
            username: value.username,
            email: value.email,
            password: value.password,
            name: value.name,
            enrollno: value.enrollno,
            branch: value.branch,
            sem: value.sem,
            contact: value.contact,
            faculty_id: selectedFaculty ? selectedFaculty._id : "",
            DOB: value.DOB,
            address: value.address
        });

        if (!result.success) {
            const firstError = result.error.issues[0];
            toast.current.show({ severity: 'error', summary: 'Validation Error', detail: firstError.message, life: 5000 });
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://localhost:4000/api/faculty/students/${studentId}`, result.data, {
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
                DOB: "",
                address: "",
                password: ""
            });
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Student updated successfully', life: 5000 });
            hide();
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User already exists', life: 5000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Update failed', life: 5000 });
            }
        }
    };

    const footer = (
        <div className='flex justify-content-center'>
            <Button label="Edit" icon="pi pi-pen-to-square" className='mx-3 mb-3 bg-green-500 border-green-500 custom-button' onClick={submit} />
            <Button label="Cancel" icon="pi pi-times" className='mx-3 mb-3 bg-red-500 border-red-500 custom-button' onClick={hide} />
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

    return (
        <div className="card flex justify-content-center text-center edit-background">
            <FormCard
                header={header}
                footer={footer}
                value={value}
                handleChange={handleChange}
                selectedFaculty={selectedFaculty}
                handleFacultyChange={handleFacultyChange}
                faculties={faculties}
                className='text-white'
            />
            <Toast ref={toast} />
        </div>
    );
}
