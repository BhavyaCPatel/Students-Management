import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const DetailsCard = ({ footer, header, value, handleChange, selectedFaculty, handleFacultyChange, faculties, editMode, handleViewMarksheet }) => {
    return (
        <Card footer={footer} header={header} className=" text-white bg-transparent overflow-y-hidden border-2 border-400 border-round-3xl">
            <div className='flex flex-wrap justify-content-center'>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="username" value={value.username} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="name" value={value.name} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="name">Name</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="email" value={value.email} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="enrollno" value={value.enrollno} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="enrollno">Enrollment No.</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="branch" value={value.branch} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="branch">Branch</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="sem" value={value.sem} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' style={{width:'150px'}} />
                        <label htmlFor="sem">Sem</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputTextarea id="address" value={value.address} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' rows={5} cols={30} />
                        <label htmlFor="address">Address</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="contact" mask="999-999-9999" value={value.contact} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="contact">Contact</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Dropdown
                            value={selectedFaculty}
                            options={faculties}
                            onChange={handleFacultyChange}
                            disabled={!editMode}
                            optionLabel="name"
                            placeholder="Select a Faculty"
                            className='bg-transparent text-white'
                        />
                        <label htmlFor="faculty">Faculty</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Calendar autoresize="true" id="DOB" value={value.DOB} onChange={handleChange} disabled={!editMode} dateFormat="yy/mm/dd" />
                        <label htmlFor="DOB">DOB</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="password" value={value.password} onChange={handleChange} disabled={!editMode} className='bg-transparent text-white' />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-warning mr-1 view" onClick={() => handleViewMarksheet()} >View Marksheet</Button>
                </div>
            </div>
        </Card>
    );
};

export default DetailsCard;