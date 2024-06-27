import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv';
import facultyRoutes from './routes/faculty.js'
import studentRoutes from './routes/student.js'
import loginRoute from './routes/login.js'


dotenv.config()
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.use('/', loginRoute)
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);



const PORT = 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
