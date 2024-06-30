import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';

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
                        <InputText id="sem" value={value.sem} onChange={handleChange} className='bg-transparent text-white' style={{width:'150px'}} />
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
                        <InputText id="contact" mask="999-999-9999" value={value.contact} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="contact">Contact</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center p-3 gap-2 fieldInput ">
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
                <div className="flex flex-wrap align-items-center p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <Calendar utoresize="true" id="DOB" value={value.DOB} onChange={handleChange} dateFormat="yy/mm/dd" />
                        <label htmlFor="DOB">DOB</label>
                    </FloatLabel>
                </div>
                <div className="flex flex-wrap align-items-center p-3 gap-2 fieldInput ">
                    <FloatLabel>
                        <InputText id="password" value={value.password} onChange={handleChange} className='bg-transparent text-white' />
                        <label htmlFor="password">Password</label>
                    </FloatLabel>
                </div>
            </div>
        </Card>
    );
};

export default FormCard;