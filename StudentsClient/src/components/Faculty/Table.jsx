import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import EditForm from './EditForm';
import { FileUpload } from 'primereact/fileupload';

export default function StudentTable() {
    const [students, setStudents] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get('http://localhost:4000/api/faculty/students', {
                headers: {
                    Authorization: `${token}`
                }
            });

            setStudents(response.data || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleViewMarksheet = (files) => {
        if (Array.isArray(files) && files.length > 0) {
            files.forEach(file => window.open(`http://localhost:4000/api/files/file/${file._id}`, '_blank'));
        } else if (files) {
            window.open(`http://localhost:4000/api/files/file/${files._id}`, '_blank');
        }
    };

    const handleUploadMarksheet = async (event, studentId) => {
        const formData = new FormData();
        formData.append('file', event.files[0], event.files[0].name);

        const token = localStorage.getItem('authToken');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `${token}`
            }
        };

        try {
            const response = await axios.post(`http://localhost:4000/api/files/upload/marksheet/${studentId}`, formData, config);
            console.log('File uploaded successfully:', response.data);
            fetchStudents();
            event.options.clear();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleEdit = (studentId) => {
        setSelectedStudentId(studentId);
        setDialogVisible(true);
    };

    const handleDelete = async (studentId) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://localhost:4000/api/faculty/students/${studentId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            fetchStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const columns = [
        { field: 'username', header: 'Username', body: (rowData) => rowData.username },
        { field: 'name', header: 'Name', body: (rowData) => rowData.name },
        { field: 'email', header: 'Email', body: (rowData) => rowData.email },
        { field: 'enrollno', header: 'Enrollment No.', body: (rowData) => rowData.enrollno },
        { field: 'branch', header: 'Branch', body: (rowData) => rowData.branch },
        { field: 'sem', header: 'Sem', body: (rowData) => rowData.sem },
        { field: 'DOB', header: 'DOB', body: (rowData) => {
            const date = new Date(rowData.DOB);
            return date.toLocaleDateString();
        }},
        { field: 'contact', header: 'Contact', body: (rowData) => rowData.contact },
        { field: 'address', header: 'Address', body: (rowData) => rowData.address },
        { field: 'files', header: 'Marksheet', body: (rowData) => (
            <div className="flex">
                {rowData.files && rowData.files.length > 0 && (
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-1" onClick={() => handleViewMarksheet(rowData.files)} />
                )}
                <FileUpload
                    mode="basic"
                    accept="application/pdf, image/*"
                    name="file"
                    customUpload
                    uploadHandler={(e) => handleUploadMarksheet(e, rowData._id)}
                    className="p-button-success p-button-rounded ml-1"
                    chooseLabel="Upload"
                    auto
                />
            </div>
        )},
        { field: 'actions', header: 'Actions', body: (rowData) => (
            <div className="flex">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-1" onClick={() => handleEdit(rowData._id)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData._id)} />
            </div>
        )}
    ];

    return (
        <div className="card m-3 mt-5">
            <DataTable value={students} paginator removableSort rows={5} rowsPerPageOptions={[5, 10, 25]} style={{ fontSize: '0.8rem' }}>
                {columns.map((col, index) => (
                    <Column key={index} sortable field={col.field} header={col.header} body={col.body} style={{ width: 'max-content', border: '0.5px solid lightgray' }} />
                ))}
            </DataTable>

            <Dialog visible={dialogVisible} modal onHide={hideDialog}>
                <EditForm hide={hideDialog} studentId={selectedStudentId} />
            </Dialog>
        </div>
    );
}
