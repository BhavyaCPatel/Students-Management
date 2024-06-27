import mongoose from 'mongoose';
import grid from 'gridfs-stream';
import { GridFsStorage } from 'multer-gridfs-storage';
import multer from 'multer';

const conn = mongoose.connection;
grid.mongo = mongoose.mongo;

let gfs;

conn.once('open', () => {
    gfs = grid(conn.db);
    console.log('GridFS initialized');
});

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'uploads' 
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

export { upload, gfs };
