// import mongoose from 'mongoose';
// import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';
// import crypto from 'crypto';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();
// const mongoURI = process.env.MONGODB_URI;

// // Create mongo connection
// const conn = mongoose.createConnection(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// let gfs;

// // Initiate GridFS when MongoDB connection is open
// conn.once('open', () => {
//     gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//         bucketName: 'files'
//     });
//     console.log('GridFS initialized');
// });

// // Create storage engine
// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//         return new Promise((resolve, reject) => {
//             crypto.randomBytes(16, (err, buf) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 const filename = buf.toString('hex') + path.extname(file.originalname);
//                 const fileInfo = {
//                     filename: filename,
//                     bucketName: 'files'
//                 };
//                 console.log('Generated filename:', filename);
//                 resolve(fileInfo);
//             });
//         });
//     }
// });

// // Initialize multer middleware with the storage engine
// const upload = multer({ storage });

// export { gfs, upload };
