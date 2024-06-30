import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import { File, StudentDetails } from '../db/index.js';
import auth from '../middlewares/authMiddleware.js';
import mongoose from 'mongoose';

const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage: storage });

// Upload marksheet
router.post('/upload/marksheet/:studentId', auth, upload.single('file'), async (req, res) => {
    try {
        const { studentId } = req.params;
        const facultyId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        console.log('Starting upload to GridFS');
        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', async () => {
            console.log('Upload finished');
            const fileId = uploadStream.id; // Get the GridFS fileId

            const newFile = new File({
                type: 'marksheet',
                student_id: studentId,
                faculty_id: facultyId,
                filename: req.file.originalname,
                path: `uploads/${fileId}`,
                file_id: fileId // Store GridFS file ID
            });

            await newFile.save();
            await StudentDetails.findByIdAndUpdate(studentId, { $push: { files: newFile._id } });

            res.status(200).json({ file: req.file });
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading file to GridFS:', error);
            res.status(500).json({ error: 'Failed to upload marksheet', details: error });
        });

    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Failed to upload marksheet', details: err });
    }
});

// Upload note
router.post('/upload/note', auth, upload.single('file'), async (req, res) => {
    try {
        const facultyId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        console.log('Starting upload to GridFS');
        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', async () => {
            console.log('Upload finished');
            const fileId = uploadStream.id; // Get the GridFS fileId

            const newFile = new File({
                type: 'note',
                faculty_id: facultyId,
                filename: req.file.originalname,
                path: `uploads/${fileId}`,
                file_id: fileId // Store GridFS file ID
            });

            await newFile.save();
            await StudentDetails.updateMany({ faculty_id: facultyId }, { $push: { files: newFile._id } });

            res.status(200).json({ file: req.file });
        });

        uploadStream.on('error', (error) => {
            console.error('Error uploading file to GridFS:', error);
            res.status(500).json({ error: 'Failed to upload note', details: error });
        });

    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).json({ error: 'Failed to upload note', details: err });
    }
});

// Retrieve file
router.get('/file/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        console.log('Requested fileId:', fileId);

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ error: 'No file exists' });
        }

        const bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: 'uploads'
        });

        const downloadStream = bucket.openDownloadStream(file.file_id);
        downloadStream.on('error', err => {
            console.error('GridFSBucketReadStream Error:', err);
            res.status(500).json({ error: 'Failed to retrieve file', details: err });
        });

        downloadStream.pipe(res);
    } catch (err) {
        console.error('Error retrieving file:', err);
        res.status(500).json({ error: 'Failed to retrieve file', details: err });
    }
});

export default router;
