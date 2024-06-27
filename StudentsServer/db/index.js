import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config()
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });


const facultySchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: 'faculty' },
    student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false }], 
});

const StudentDetailsSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    name: { type: String, required: true },
    enrollno: { type: Number, required: true },
    branch: { type: String, required: true },
    DOB: { type: Date, required: true },
    sem: { type: Number, required: true },
    address: { type: String, required: true },
    contact: { type: Number, required: true },
    role: { type: String, default: 'student' },
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
});


const fileSchema = new mongoose.Schema({
    type: { type: String, enum: ['marksheet', 'note'], required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false },
    faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    filename: { type: String, required: true }, 
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    uploaded_at: { type: Date, default: Date.now }
});

const Faculty = mongoose.model('Faculty', facultySchema);
const StudentDetails = mongoose.model('StudentDetails', StudentDetailsSchema);
const File = mongoose.model('File', fileSchema);

export { File, Faculty, StudentDetails };