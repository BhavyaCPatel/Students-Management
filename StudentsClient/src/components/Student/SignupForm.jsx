
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { z } from 'zod';
import FormCard from '../FormCard';

export default function SignupForm() {

    const toast = useRef(null);     
    const navigate = useNavigate();

    const singupschema = z.object({
        username: z.string().min(1, { message: "Username is required" }),
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        enrollno: z.string().regex(/^\d{14}$/, { message: "Enrollment number must be 14 digits" }),
        branch: z.string().min(1, { message: "Branch is required" }),
        sem: z.string().regex(/^\d{1}$/, { message: "Invalid Semester, only 1 digit allowed" }),
        contact: z.string().regex(/^\d{10}$/, { message: "Contact number must be 10 digits" }),
        address: z.string().min(1, { message: "Address is required" }),
        DOB: z.date(),
        password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
        faculty_id: z.string().min(1, { message: "Faculty is required" }),
    })

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

    const header = (
        <h2 className='text-center'>Sign-Up</h2>
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
            const response = await axios({
                method: 'post',
                url: 'http://localhost:4000/api/student/signup',
                data: result.data
            });
            localStorage.setItem('userId', response.data.userId);
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
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'User signed up successfully', life: 5000 });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data.message === 'User already exists') {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'User already exists', life: 5000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Sign up failed', life: 5000 });
            }
        }
    }

    const footer = (
        <>
            <Button label="Sign-Up" icon="pi pi-sign-in" className='mb-3 bg-green-500 border-green-500 custom-button' onClick={submit} />
            <div>
                <p className='text-white'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
            </div>
        </>
    );

    const handleChange = (e) => {
        setValue({
            ...value,
            [e.target.id]: e.target.value
        });
    }

    const handleFacultyChange = (e) => {
        console.log(e.value)
        setSelectedFaculty(e.value);
    };


    return (
        <div className="card flex justify-content-center text-center bg-transparent m-7">
            <FormCard
                header={header}
                footer={footer}
                value={value}
                handleChange={handleChange}
                selectedFaculty={selectedFaculty}
                handleFacultyChange={handleFacultyChange}
                faculties={faculties}
            />
            <Toast ref={toast} />
        </div>
    )
}
