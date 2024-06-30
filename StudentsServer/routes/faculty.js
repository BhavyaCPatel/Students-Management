import express from 'express';
import auth from '../middlewares/authMiddleware.js';
import { Faculty, StudentDetails, File } from '../db/index.js';
import zod from 'zod';
import bcrypt from 'bcryptjs';

const router = express.Router();

const usernameSchema = zod.string().min(3);
const nameSchema = zod.string();
const departmentSchema = zod.string();
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

router.post('/signup', async (req, res) => {
    try {
        const username = usernameSchema.parse(req.body.username);
        const name = nameSchema.parse(req.body.name);
        const email = emailSchema.parse(req.body.email);
        const department = departmentSchema.parse(req.body.department);
        const password = passwordSchema.parse(req.body.password);

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await Faculty.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }

        const faculty = new Faculty({
            username,
            name,
            email,
            department,
            password: hashedPassword
        });

        await faculty.save();

        res.status(201).json({ message: 'User created successfully', faculty });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.errors, message: 'Internal server error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const faculties = await Faculty.find({}, 'name'); 
        res.json(faculties);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/students', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const students = await StudentDetails.find({ faculty_id: req.user.userId }).populate('files');
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/students/:id', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const student = await StudentDetails.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }

});



router.post('/students', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const student = new StudentDetails({
            username: req.body.username,
            password: hashedPassword,
            faculty_id: req.user.userId,
            name: req.body.name,
            enrollno: req.body.enrollno,
            branch: req.body.branch,
            DOB: req.body.DOB,
            sem: req.body.sem,
            address: req.body.address,
            contact: req.body.contact,
        });

        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.errors });
    }
});

router.put('/students/:id', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { username, email, name, enrollno, branch, DOB, sem, address, contact, faculty_id, password } = req.body;

    try {
        const student = await StudentDetails.findById(req.params.id);

        if (!student || student.faculty_id.toString() !== req.user.userId) {
            return res.status(404).json({ msg: 'Student Not Found.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        student.name = name || student.name;
        student.username = username || student.username;
        student.email = email || student.email;
        student.password = hashedPassword || student.password;
        student.faculty_id = faculty_id || student.faculty_id;
        student.enrollno = enrollno || student.enrollno;
        student.branch = branch || student.branch;
        student.DOB = DOB || student.DOB;
        student.sem = sem || student.sem;
        student.address = address || student.address;
        student.contact = contact || student.contact;

        await student.save();
        console.log('Student Updated')
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/students/:id', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const student = await StudentDetails.findById(req.params.id);
        if (!student || student.faculty_id.toString() !== req.user.userId) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        await StudentDetails.findByIdAndDelete(req.params.id);
        await Faculty.findByIdAndUpdate(req.user.userId, { $unset: { student_id: student._id } });

        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
