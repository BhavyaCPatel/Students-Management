import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Faculty, StudentDetails, File } from '../db/index.js';
import auth from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email, faculty_id, name, enrollno, branch, DOB, sem, address, contact } = req.body;
    try {
        let student = await StudentDetails.findOne({ username });
        if (student) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        student = new StudentDetails({
            username,
            name,
            email,
            enrollno,
            branch,
            sem,
            address,
            contact,
            faculty_id,
            DOB,
            password,
            role: 'student'
        });

        student.password = await bcrypt.hash(password, 10);

        await student.save();

        await Faculty.findByIdAndUpdate(faculty_id, { $push: { student_id: student._id } });

        res.status(201).json({ msg: 'Account created successfully. Please log in.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         let student = await StudentDetails.findOne({ username });
//         if (!student) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const isMatch = await bcrypt.compare(password, student.password);
//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Invalid Credentials' });
//         }

//         const payload = {
//             user: {
//                 id: student.id,
//                 role: student.role
//             }
//         };

//         jwt.sign(
//             payload,
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' },
//             (err, token) => {
//                 if (err) throw err;
//                 res.json({ token, role: student.role });
//             }
//         );
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const student = await StudentDetails.findById(req.user.id).populate('faculty_id');
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { name, enrollno, branch, DOB, sem, address, contact } = req.body;

    try {
        const student = await StudentDetails.findById(req.user.id);

        student.name = name || student.name;
        student.enrollno = enrollno || student.enrollno;
        student.branch = branch || student.branch;
        student.DOB = DOB || student.DOB;
        student.sem = sem || student.sem;
        student.address = address || student.address;
        student.contact = contact || student.contact;

        await student.save();
        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/files/:type', auth, async (req, res) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    const { type } = req.params;
    try {
        const files = await File.find({ student_id: req.user.id, type });
        res.json(files);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
