import Router from 'express';
import auth from '../middlewares/authMiddleware.js';
import { Faculty, StudentDetails, File } from '../db/index.js';
import zod from 'zod';
import bcrypt from 'bcryptjs';
import { upload, gfs } from '../gridfs.js';

const router = Router();

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


        const faculty = await Faculty.create({
            username,
            name,
            email,
            department,
            password: hashedPassword
        });

        res.json({ message: 'User created successfully', faculty: faculty, });

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.errors, message: 'Internal server error'  });
    }
});

// router.post('/login', async (req, res) => {
//     try {
//         const username = usernameSchema.parse(req.body.username);
//         const password = passwordSchema.parse(req.body.password);

//         const faculty = await Faculty.findOne({ username });

//         if (!faculty) {
//             throw new Error('Invalid username');
//         }

//         const isPasswordValid = await bcrypt.compare(password, faculty.password);

//         if (!isPasswordValid) {
//             throw new Error('Invalid password');
//         }

//         const token = jwt.sign({ username: faculty.username, role: faculty.role }, jwtSecret);

//         res.json({ token });

//     } catch (err) {
//         res.status(400).json({ error: err.errors });
//     }

// });

router.get('/students', auth, async (req, res) => {

    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const students = await StudentDetails.find({ faculty_id: req.user.userId });
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.post('/students', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const student = await StudentDetails.create({
            username: req.body.username,
            password: req.body.password,
            faculty_id: req.user.id,
            name: req.body.name,
            enrollno: req.body.enrollno,
            branch: req.body.branch,
            DOB: req.body.DOB,
            sem: req.body.sem,
            address: req.body.address,
            contact: req.body.contact,
        });

        student.password = await bcrypt.hash(password, 10);

        await student.save();
        res.json(student);

    } catch (err) {
        res.status(400).json({ error: err.errors });
    }

})

router.put('/students/:id', auth, async (req, res) => {

    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    const { name, enrollno, branch, DOB, sem, address, contact } = req.body;

    try {
        const student = await StudentDetails.findById(req.params.id);

        if (!student || student.faculty_id.toString() !== req.user.id) {
            res.status(404).json({ msg: 'Student Not Found.' });
        }

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
})

router.delete('/students/:id', auth, async (req, res) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ msg: 'Access denied' });
    }

    try {
        const student = await StudentDetails.findById(req.params.id);
        if (!student || student.faculty_id.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        await student.remove();
        res.json({ msg: 'Student removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        const newFile = new File({
            type: req.body.type,
            student_id: req.body.student_id || null,
            faculty_id: req.user.id,
            file_id: req.file.id 
        });

        await newFile.save();

        res.json({ file: newFile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/files/:fileId', async (req, res) => {
    try {
        const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.fileId) });

        if (!file) {
            return res.status(404).json({ msg: 'File not found' });
        }

        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;