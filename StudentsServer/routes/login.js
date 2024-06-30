import Router from 'express'
import { Faculty, StudentDetails } from '../db/index.js';
import zod from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();
const jwtSecret = process.env.JWT_Secret;

const usernameSchema = zod.string().min(3);
const passwordSchema = zod.string().min(6);

router.post('/login', async (req, res) => {
    try {
        const username = usernameSchema.parse(req.body.username);
        const password = passwordSchema.parse(req.body.password);

        let user = await Faculty.findOne({ username });

        if (!user) {
            user = await StudentDetails.findOne({ username });
        }
        if (!user) {
            throw new Error('Invalid username');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign({ userId: user._id ,username: user.username, role: user.role, expiresIn: '1h' }, jwtSecret);
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;