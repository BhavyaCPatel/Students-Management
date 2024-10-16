import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';


const FormCard = ({ footer, header, value, handleChange, selectedFaculty, handleFacultyChange, faculties }) => {
    return (
        <Card footer={footer} header={header} className=" text-white bg-transparent overflow-y-hidden border-2 border-400 border-round-3xl">
            <div className='flex flex-wrap justify-content-center'>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="username" value={value.username} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="username">Username</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="name" value={value.name} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="name">Name</label>
                    </FloatLabel>
                </div>
                <div>
                    <label htmlFor="Gender" style={{color: '#6c757d'}}>Gender</label>
                    <div className="flex  flex-wrap gap-3 mt-1">
                        <div className="flex align-items-center">
                            <RadioButton inputId="gender1" name="gender" value="Male" onChange={handleChange} checked={value.gender === 'Male'} />
                            <label htmlFor="gender1" className="ml-2">Male</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="gender2" name="gender" value="Female" onChange={handleChange} checked={value.gender === 'Female'} />
                            <label htmlFor="gender2" className="ml-2">Female</label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="email" value={value.email} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="enrollno" value={value.enrollno} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="enrollno">Enrollment No.</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="branch" value={value.branch} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="branch">Branch</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="sem" value={value.sem} onChange={handleChange} className='bg-transparent text-white' style={{ width: '150px' }} />
                        <label htmlFor="sem">Sem</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputTextarea id="address" value={value.address} onChange={handleChange} className='bg-transparent text-white' rows={5} cols={30} />
                        <label htmlFor="address">Address</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="contact" value={value.contact} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="contact">Contact</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Dropdown
                            value={selectedFaculty}
                            options={faculties}
                            onChange={handleFacultyChange}
                            optionLabel="name"
                            placeholder="Select a Faculty"
                            className='bg-transparent text-white'
                        />
                        <label htmlFor="faculty">Faculty</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Calendar autoresize="true" id="DOB" value={value.DOB} onChange={handleChange} dateFormat="yy/mm/dd" />
                        <label htmlFor="DOB">DOB</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center mb-3 p-3 gap-2 fieldInput">
                    <FloatLabel>
                        <Password inputId="password" value={value.password} onChange={handleChange} className='bg-transparent text-white' toggleMask />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                </div>
            </div>
        </Card>
    );
};

export default FormCard;